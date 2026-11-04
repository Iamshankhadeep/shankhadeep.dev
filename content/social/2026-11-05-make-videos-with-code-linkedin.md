# LinkedIn post draft: training a 9B model to make videos with code

Post URL: https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Attach `content/social/media/2026-11-05-montage-1080.mp4` (1080×1080, 25 s, with sound). LinkedIn plays it muted
until someone taps it, so the first frames carry the post.

To get more reach, put the link in the first comment instead of the post body. The last lines below work either way.

---

I trained a 9B open model to make short ink-wash videos by writing them as JavaScript.

Before training, it got 0 of 100 briefs to render. After eight rounds of fine-tuning and reinforcement learning, it makes a working video for 39 of 40 briefs it never saw.

I chose code over pixels because a program can check code. A video written as code either renders or crashes, and either loops cleanly or doesn't. That pass or fail signal is what reinforcement learning trains on.

What I learned:

Every reward I wrote got gamed. A reward for rendering produced videos that worked but were empty. A content judge made more of them work, but no better. A check on 7 still frames produced videos that barely moved, and 11 of the 13 best froze for seconds.

A reward that compares frames for motion fixed that. After I added it, reinforcement learning stopped trading animation away to pass the checks.

More data helped more than any reward change. Going from 260 to 1,944 training videos in one style beat every tweak. Claude Code agents wrote them, and I reviewed contact sheets of all 2,000.

Making the data cost about 40 times more than training on it, about $3,360 of Claude compared with about $85 of GPU time.

Once trained, the model is cheap to run. A working video costs about $0.006 on a rented A100. Asking Claude Sonnet or Opus directly costs 20 to 30 cents per working video, but Claude's videos have far more detail and brushwork.

Next to the reference videos, the results are still sparse. The full write-up has every reward that failed, the dataset, the numbers and the costs:
https://shankhadeep.dev/blog/training-a-9b-model-to-make-videos-with-code

Surya's post "RL-ing Qwen to paint with code" started this project.

#MachineLearning #ReinforcementLearning #GenerativeAI
