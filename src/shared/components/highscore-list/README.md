#### Detailed Score Calculation

When a game is started with 4 hours (14,400 seconds):

##### Formula:

```
Base Score = 14 - (Incorrect Answers × 0.5 + Skips Used × 0.25)
Time Multiplier = Remaining Time in Seconds / 4
Final Score = Base Score × Time Multiplier
```

##### Example:

If you complete the game with:

- 0 incorrect answers
- 0 skips used
- 3 hours remaining (10,800 seconds)

##### Calculation:

1. Base Score = 14 - (0 × 0.5 + 0 × 0.25) = 14
2. Time Multiplier = 2,700,800 / 2 = 1,350
3. Final Score = 14 × 1,350 = 18,900

##### Difficulty Multipliers:

- Easy: 1 hour (60 min) → Time remaining ÷ 2
- Normal: 30 minutes → Time remaining ÷ 1
- Hard: 15 minutes → Time remaining × 4

##### Example Scores (Perfect Game):

- Easy (1h with 1h remaining): 14 × (3600/2) = 25,200
- Normal (30m with 30m remaining): 14 × 1800 = 25,200
- Hard (15m with 15m remaining): 14 × (900×4) = 50,400

##### Why the division by 4?

The division balances scoring across difficulties. Without it, easy mode would give unfairly high scores. The harder the difficulty, the less your remaining time is divided, rewarding risk-taking.

##### Score Ranges (Perfect Game):

- 4h with 4h remaining: 14 × (14,400/4) = 50,400
- 2h with 2h remaining: 14 × (7,200/2) = 50,400
- 1h with 1h remaining: 14 × 3,600 = 50,400

All difficulties can achieve the same max score, making it fair!
