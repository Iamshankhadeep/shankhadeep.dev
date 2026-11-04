# LinkedIn Post Draft: Training a 9B Model to Make Videos with Code

Post URL: https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Attach: `content/social/media/2026-11-05-montage-1080.mp4` (1080×1080, 25 s, with sound). LinkedIn plays it muted
until someone taps it, so the first frames carry the post.

Tip: put the link in the first comment instead of the post body if you want more reach; the last line below works
either way.

---

I trained a 9B open model to make short ink-wash videos by writing them as JavaScript.

Before training, it got 0 of 100 briefs to render. After eight rounds of fine-tuning and reinforcement learning, it makes a working video for 39 of 40 briefs it never saw.

Why code instead of pixels? A video written as code can be read, edited and checked by a program. It renders or it crashes. It loops or it doesn't. That makes it something you can train on with RL.

What I learned:

→ Every reward I wrote got gamed. A "does it render" reward produced videos that worked but were empty. A content judge made more of them work, but not better. A check on 7 still frames produced videos that barely moved: 11 of the 13 best froze for seconds.

→ The fix was measuring what I actually wanted. A reward that watches motion frame to frame stopped RL from trading animation for passing.

→ More data beat every reward change. Going from 260 to 1,944 training videos in one style did more than any tweak. Claude Code agents wrote them, and I reviewed contact sheets of all 2,000.

→ Making the data cost about 40× more than training on it: ~$3,360 of Claude vs ~$85 of GPU time.

→ Once trained, it's cheap. About $0.006 per working video on a rented A100, vs ~$0.20–0.30 asking Claude Sonnet or Opus directly. Claude's videos are still much richer, though.

The results are still crude next to the references. The full write-up covers every reward that failed, the dataset, the numbers and the costs:
https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Inspired by Surya's "RL-ing Qwen to paint with code".

#MachineLearning #ReinforcementLearning #GenerativeAI
