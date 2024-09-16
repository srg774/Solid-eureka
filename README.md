# Game Development Journey

The premise behind developing my own game started with an interest in watching others develop theirs. I've watched people like Ben Heck write code in C from scratch and draw out assets one pixel at a time. This approach seems to be the ultimate in 2D game production. While I have watched one or two other developers as well, Ben stands out to me.

Recently, I became fascinated by the story of Ryan Evan Kadrian. Watching an early YouTube documentary about his life and struggles, he developed a video game called 'Platform Masters' which looks like a lot of fun. It seems to be a cross between Sonic the Hedgehog and Lemmings.

This is what encouraged me, one Saturday afternoon, to give it a try myself—with the help of ChatGPT. The whole endeavour took around 7 hours from start to finish. It wasn't just about producing a single prompt but involved an iterative process.

![Initial development image](https://example.com/path/to/initial-development-image.png)

I'm going to share the code with a description so we can dissect what's happening. I already knew it was going to be a JavaScript based game, which reminded me of the early Flash games. When I looked into how to host the game on my site, ChatGPT recommended GitHub to host the necessary files and serve the page and I already had an account.

I hit a lot of dead ends along the way. For instance, I was aiming for something like Nick's 'Platform Masters' but ended up with something completely different. Of course, it has similarities with other platform games, and I'm sure I could find a similar game if I searched.

Some of the hurdles during development included trying to prevent long button presses to limit jumps. I couldn't get the code generated to sort this out without dozens of attempts. The block logic was tricky to pin down in terms of game-over conditions. I also had another hurdle with dynamic canvas resizing. I got it working and it looked good, but it broke the block generation mechanics, so I couldn't implement it. Instead, I set the resolution to match my own mobile device.

The touch controls on mobile work pretty well, as do the desktop controls. I hope the game itself is intuitive. The sprite bouncing up and down were entirely ChatGPT's choices, picking what it thought was best. These are, of course, classic 8-bit themes and colours, come to think of it.

The sprite art isn't mine but from a freeware site. I wasted hours trying to get the JavaScript code to animate the sprite using a single frame sheet image, but in the end, I quickly cropped out two images (left and right). That's why one sprite is slightly different; I just quickly picked two frames from the walking animation set. I'm sure there's a program that can deal with these sprite sheets.

Anyway, that’s it. I hope you enjoy it. I think my high score is 199, but I am working toward 450, at which point the scrolling speed increases from 0.5 to 5. I've already found a slight glitch to get more points.

Happy gaming!

## Frame Set Sheet

Source: [OpenGameArt](https://opengameart.org/users/sogomn)

## Initial Development of the Gameplay Mechanics

![Platform Masters screenshot](https://lh6.googleusercontent.com/zfCkhKAHrazvRxtnEJ14rxCZLJDA3Y2YpXNh1V7-jyqi1ycZsVw0Cy6WiBgFe7hQ-8rNxfhamARfQumrEnfGrviwXACm2vYANFCM0qo0wunNElw2ot45K_2EJlgTnxf_GA=w1280)

Source: [Kyle Kukshtel](https://kylekukshtel.com/platform-master)

![Initial Development Image 1](https://lh4.googleusercontent.com/XHmAiPKMHa8PC8XmjalnzgCx1_ebj8SOaUZjyTdw9wauIKUOalYSDs_2Uh28QEN8RXbjLeHBOKomEv4RZsNOgqGf1NmwMd9kA3sNFV5IrpRkBRxv-TbVZ2k6udCksnB0=w1280)

![Initial Development Image 2](https://lh5.googleusercontent.com/DVenaprA8UGIiK_hF6a_fHA7eoMp7sUknDGMZJ6bUHQSnU04xuMLYbAdDq0IWcIeBIFTpwuik1WyblTxIgMzCyL1CLT52qpZbUFh4tgGcYhQv1-25GfJ4Y2TKlvX1Q1VAg=w1280)


