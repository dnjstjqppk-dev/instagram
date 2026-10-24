import 'package:flutter/material.dart';
import 'theme/aura_theme.dart';

void main() {
  runApp(const AuraApp());
}

class AuraApp extends StatelessWidget {
  const AuraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aura Social',
      debugShowCheckedModeBanner: false,
      theme: AuraTheme.lightTheme,
      darkTheme: AuraTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeFeedScreen(),
    const ExploreScreen(),
    const ReelsScreen(),
    const DirectInboxScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            activeIcon: Icon(Icons.search_rounded),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.movie_creation_outlined),
            activeIcon: Icon(Icons.movie_creation),
            label: 'Reels',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.send_outlined),
            activeIcon: Icon(Icons.send),
            label: 'Direct',
          ),
          BottomNavigationBarItem(
            icon: CircleAvatar(
              radius: 12,
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'),
            ),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class HomeFeedScreen extends StatelessWidget {
  const HomeFeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Aura',
          style: TextStyle(
            fontFamily: 'serif',
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.favorite_border),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        children: [
          // Story Tray
          SizedBox(
            height: 104,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: 8,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 6),
                    child: Column(
                      children: [
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 32,
                              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'),
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: CircleAvatar(
                                radius: 10,
                                backgroundColor: AuraTheme.accentColor,
                                child: Icon(Icons.add, size: 16, color: Colors.white),
                              ),
                            )
                          ],
                        ),
                        SizedBox(height: 4),
                        Text('Your story', style: TextStyle(fontSize: 11)),
                      ],
                    ),
                  );
                }
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(2.5),
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: AuraTheme.storyRingGradient,
                        ),
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Theme.of(context).scaffoldBackgroundColor,
                          ),
                          child: const CircleAvatar(
                            radius: 28,
                            backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text('user_$index', style: const TextStyle(fontSize: 11)),
                    ],
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1),
          // Post Card Demo
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const ListTile(
                  leading: CircleAvatar(
                    backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
                  ),
                  title: Text('sarah_art', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  subtitle: Text('Seoul, South Korea', style: TextStyle(fontSize: 11)),
                  trailing: Icon(Icons.more_vert),
                ),
                Image.network(
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080',
                  height: 380,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Row(
                    children: [
                      IconButton(icon: const Icon(Icons.favorite_border), onPressed: () {}),
                      IconButton(icon: const Icon(Icons.chat_bubble_outline), onPressed: () {}),
                      IconButton(icon: const Icon(Icons.send_outlined), onPressed: () {}),
                      const Spacer(),
                      IconButton(icon: const Icon(Icons.bookmark_border), onPressed: () {}),
                    ],
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text('428 likes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(text: 'sarah_art ', style: TextStyle(fontWeight: FontWeight.bold)),
                        TextSpan(text: 'Golden hour reflections through the prism ✨ #photography'),
                      ],
                    ),
                    style: TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          height: 38,
          decoration: BoxDecoration(
            color: Colors.grey.withOpacity(0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const TextField(
            decoration: InputDecoration(
              hintText: 'Search',
              prefixIcon: Icon(Icons.search, size: 20),
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(vertical: 8),
            ),
          ),
        ),
      ),
      body: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 2,
          mainAxisSpacing: 2,
        ),
        itemCount: 21,
        itemBuilder: (context, index) {
          return Image.network(
            'https://picsum.photos/300/300?random=$index',
            fit: BoxFit.cover,
          );
        },
      ),
    );
  }
}

class ReelsScreen extends StatelessWidget {
  const ReelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: PageView.builder(
        scrollDirection: Axis.vertical,
        itemCount: 5,
        itemBuilder: (context, index) {
          return Stack(
            fit: StackFit.expand,
            children: [
              Image.network(
                'https://picsum.photos/720/1280?random=$index',
                fit: BoxFit.cover,
              ),
              Positioned(
                right: 16,
                bottom: 80,
                child: Column(
                  children: [
                    IconButton(icon: const Icon(Icons.favorite_border, color: Colors.white, size: 30), onPressed: () {}),
                    const Text('14.2k', style: TextStyle(color: Colors.white, fontSize: 12)),
                    const SizedBox(height: 16),
                    IconButton(icon: const Icon(Icons.chat_bubble_outline, color: Colors.white, size: 28), onPressed: () {}),
                    const Text('320', style: TextStyle(color: Colors.white, fontSize: 12)),
                    const SizedBox(height: 16),
                    IconButton(icon: const Icon(Icons.send_outlined, color: Colors.white, size: 28), onPressed: () {}),
                  ],
                ),
              ),
              const Positioned(
                left: 16,
                bottom: 30,
                right: 80,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('@alex_photo', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                    SizedBox(height: 6),
                    Text('Capturing mountain sunrise with drone 🏔️ #nature #reels', style: TextStyle(color: Colors.white, fontSize: 13)),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class DirectInboxScreen extends StatelessWidget {
  const DirectInboxScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.edit_note, size: 28), onPressed: () {}),
        ],
      ),
      body: ListView(
        children: [
          ListTile(
            leading: const CircleAvatar(
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'),
            ),
            title: const Text('alex_photo', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Loved that last photo shot! • 20m'),
            onTap: () {},
          ),
          ListTile(
            leading: const CircleAvatar(
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'),
            ),
            title: const Text('aura_official', style: TextStyle(fontWeight: FontWeight.bold)),
            subtitle: const Text('Welcome to Aura Platform! • 1d'),
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('sarah_art', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.add_box_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.menu), onPressed: () {}),
        ],
      ),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 40,
                  backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Column(
                        children: [
                          Text('24', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('Posts', style: TextStyle(fontSize: 13)),
                        ],
                      ),
                      Column(
                        children: [
                          Text('4,890', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('Followers', style: TextStyle(fontSize: 13)),
                        ],
                      ),
                      Column(
                        children: [
                          Text('320', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          Text('Following', style: TextStyle(fontSize: 13)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Sarah Jenkins', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                Text('Visual Artist & Photographer', style: TextStyle(color: Colors.grey, fontSize: 13)),
                SizedBox(height: 4),
                Text('Capturing light, architectural rhythms & minimalist forms in Seoul 📷', style: TextStyle(fontSize: 13)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Divider(height: 1),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 2,
              mainAxisSpacing: 2,
            ),
            itemCount: 9,
            itemBuilder: (context, index) {
              return Image.network(
                'https://picsum.photos/400/400?random=$index',
                fit: BoxFit.cover,
              );
            },
          ),
        ],
      ),
    );
  }
}
