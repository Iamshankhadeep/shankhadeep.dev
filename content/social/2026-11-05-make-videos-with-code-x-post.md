# X Post Draft: Training a 9B Model to Make Videos with Code

Post URL: https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Format follows Surya's post (https://x.com/kickingkeys/status/2091570990048276897): one line plus a
square montage with sound. The replies are optional, for anyone who opens the post.

Media: `public/blog/training-a-9b-model-to-make-videos-with-code/montage.mp4` (1080×1080, 25 s, with sound).

## Main post

Attach: montage.mp4

You can RL a 9B model to make ink-wash videos with javascript too.

Every clip is a video it wrote, as code, for a brief it never saw. 0 of 100 before training. 247 of 320 after.

## Reply 1

What moved the numbers: 2,000 training videos in one style, and a reward that watches motion.

Before the motion reward, RL learned to pass the checks by barely animating. 11 of its 13 best videos froze for seconds.

## Reply 2

It was trained on ~$85 of A100 time. Making the data cost ~$3,360 of Claude.

The videos are still sparse next to the references. Full write-up, with every reward that got gamed:
https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Inspired by @kickingkeys: https://surya.website/rling-qwen-to-paint-with-code
