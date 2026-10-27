package pipeline

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/jpeg"
	"image/png"
	"io"
	"mime"
	"path/filepath"
)

var (
	ErrUnsupportedFormat = errors.New("unsupported image format")
	ErrImageTooLarge     = errors.New("image exceeds maximum dimension (8192px)")
)

type ProcessedImageResult struct {
	OriginalWidth   int
	OriginalHeight  int
	ThumbnailBytes  []byte
	FeedFormatBytes []byte
	Format          string
}

type ImageProcessor struct {
	MaxDimension int
}

func NewImageProcessor() *ImageProcessor {
	return &ImageProcessor{
		MaxDimension: 8192,
	}
}

// ProcessImage validates, strips EXIF (by re-encoding pixel data into fresh canvas),
// and creates multi-resolution renditions (150x150 thumbnail and max 1080x1080 feed display).
func (p *ImageProcessor) ProcessImage(r io.Reader, filename string) (*ProcessedImageResult, error) {
	data, err := io.ReadAll(r)
	if err != nil {
		return nil, err
	}

	ext := stringsToLower(filepath.Ext(filename))
	_ = mime.TypeByExtension(ext)

	img, format, err := image.Decode(bytes.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrUnsupportedFormat, err)
	}

	bounds := img.Bounds()
	w, h := bounds.Dx(), bounds.Dy()

	if w > p.MaxDimension || h > p.MaxDimension {
		return nil, ErrImageTooLarge
	}

	// 1. Generate 150x150 square thumbnail (Center cropped)
	thumb := p.cropAndResizeSquare(img, 150)
	var thumbBuf bytes.Buffer
	if err := jpeg.Encode(&thumbBuf, thumb, &jpeg.Options{Quality: 85}); err != nil {
		return nil, err
	}

	// 2. Generate Feed rendition (Aspect ratio preserved, max dimension 1080)
	feedImg := p.resizeFit(img, 1080, 1080)
	var feedBuf bytes.Buffer
	if format == "png" {
		if err := png.Encode(&feedBuf, feedImg); err != nil {
			return nil, err
		}
	} else {
		if err := jpeg.Encode(&feedBuf, feedImg, &jpeg.Options{Quality: 90}); err != nil {
			return nil, err
		}
	}

	return &ProcessedImageResult{
		OriginalWidth:   w,
		OriginalHeight:  h,
		ThumbnailBytes:  thumbBuf.Bytes(),
		FeedFormatBytes: feedBuf.Bytes(),
		Format:          format,
	}, nil
}

func (p *ImageProcessor) cropAndResizeSquare(src image.Image, size int) image.Image {
	bounds := src.Bounds()
	w, h := bounds.Dx(), bounds.Dy()

	minDim := w
	if h < minDim {
		minDim = h
	}

	// Center crop rectangle
	cropX := (w - minDim) / 2
	cropY := (h - minDim) / 2
	cropRect := image.Rect(bounds.Min.X+cropX, bounds.Min.Y+cropY, bounds.Min.X+cropX+minDim, bounds.Min.Y+cropY+minDim)

	dst := image.NewRGBA(image.Rect(0, 0, size, size))

	// Bilinear downsampling approximation
	for y := 0; y < size; y++ {
		for x := 0; x < size; x++ {
			srcX := cropRect.Min.X + (x * minDim / size)
			srcY := cropRect.Min.Y + (y * minDim / size)
			dst.Set(x, y, src.At(srcX, srcY))
		}
	}
	return dst
}

func (p *ImageProcessor) resizeFit(src image.Image, maxW, maxH int) image.Image {
	bounds := src.Bounds()
	w, h := bounds.Dx(), bounds.Dy()

	if w <= maxW && h <= maxH {
		// Fresh copy to guarantee EXIF stripping
		dst := image.NewRGBA(image.Rect(0, 0, w, h))
		draw.Draw(dst, dst.Bounds(), src, bounds.Min, draw.Src)
		return dst
	}

	ratio := float64(w) / float64(h)
	targetW, targetH := maxW, maxH
	if ratio > 1 {
		targetH = int(float64(maxW) / ratio)
	} else {
		targetW = int(float64(maxH) * ratio)
	}

	dst := image.NewRGBA(image.Rect(0, 0, targetW, targetH))
	for y := 0; y < targetH; y++ {
		for x := 0; x < targetW; x++ {
			srcX := bounds.Min.X + (x * w / targetW)
			srcY := bounds.Min.Y + (y * h / targetH)
			dst.Set(x, y, src.At(srcX, srcY))
		}
	}
	return dst
}

func stringsToLower(s string) string {
	b := make([]byte, len(s))
	for i := 0; i < len(s); i++ {
		c := s[i]
		if 'A' <= c && c <= 'Z' {
			c += 'a' - 'A'
		}
		b[i] = c
	}
	return string(b)
}

// Helper to create synthetic test image
func CreateSyntheticImage(w, h int, c color.Color) image.Image {
	img := image.NewRGBA(image.Rect(0, 0, w, h))
	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			img.Set(x, y, c)
		}
	}
	return img
}
