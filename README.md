# Developing a Cross-Platform Game

**https://srg774.github.io/solid-eureka/**

Some of the hurdles during development included trying to prevent long button presses to limit jumps. I couldn't get the code generated to sort this out without dozens of attempts. The block logic was tricky to pin down in terms of game-over conditions. I also had another hurdle with dynamic canvas resizing. I got it working and it looked good, but it broke the block generation mechanics, so I couldn't implement it. Instead, I set the resolution to match my own mobile device.

The touch controls on mobile work pretty well, as do the desktop controls. I hope the game itself is intuitive. The sprite bouncing up and down were entirely ChatGPT's choices, picking what it thought was best. These are, of course, classic 8-bit themes and colors, come to think of it.

The sprite art isn't mine but from a freeware site. I wasted hours trying to get the JavaScript code to animate the sprite using a single frame sheet image, but in the end, I quickly cropped out two images (left and right). That's why one sprite is slightly different; I just quickly picked two frames from the walking animation set. I'm sure there's a program that can deal with these sprite sheets.

Anyway, that’s it. I hope you enjoy it. I think my high score is 199, but I am working toward 450, at which point the scrolling speed increases from 0.5 to 5. I've already found a slight glitch to get more points.

Happy gaming!



**intial development of the game play mechanics**

![Screenshot 2024-09-16](https://github.com/srg774/solid-eureka/blob/main/info/Screenshot%202024-09-16%2014.30.30.png)

**Platform Masters screenshot. Source: https://kylekukshtel.com/platform-master**

![Initial Development](https://raw.githubusercontent.com/srg774/solid-eureka/main/info/Screenshot%202024-09-15%2010.11.59.png)

**Frame set sheet. Source: https://opengameart.org/users/sogomn**

![Frame Set Sheet (Enlarged)](https://github.com/srg774/solid-eureka/blob/main/info/guy%20(2).png)



