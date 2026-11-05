# ZibZib, a game for explaining things clearly

- URL: https://paolodona.com/blog/zibzib.html
- Published: 5th November 2026 (2026-11-05)
- Summary: ZibZib is a small speaking game I built for my ten-year-old. A friendly alien asks questions, you answer out loud, and along the way you practise explaining things clearly and learn new words.

Explaining something well is a surprisingly hard skill. It is not only about knowing the answer: you have to set the scene, put events in a sensible order, link one idea to the next and pick the right word rather than "the thing". Adults get paid to do this and still struggle with it.

I wanted my ten-year-old to practise it in a way that does not feel like homework, so over a few evenings I built [ZibZib](https://zibzib.it): a speaking game in Italian where the goal is to **explain yourself clearly and learn more words** while having fun.

## How it works

A colourful alien called Zib has landed on Earth and knows nothing about it. Each round, Zib asks a question about something the player loves (Minecraft, Super Mario, Among Us, science) or about everyday life: how do you get to the bar, how does the gardener mow the lawn?

There is no timer. You take as long as you like to think, tap the button, and then talk into the microphone. Because Zib genuinely does not understand, vague answers ("you take the thing and put it there") get a puzzled reaction, and the gaps in the explanation become obvious in a funny, friendly way instead of a corrective one.

After each answer the game shows a score split into a few colourful dimensions, then gives just **one thing that went well**, **one tip**, and a slightly better version of the player's *own* answer. Then it offers a rematch on the same question for bonus points. A session is three rounds and takes around ten minutes.

## Words, collected like cards

Every few rounds a face-down card flips over and shows a **mystery word**, something like *sonnolenza*. Zib asks whether you know it. If you do, you show it with a sentence of your own. If you don't, Zib explains it in kid language, reads two examples, and you invent a new sentence. The word then joins an album of word cards that comes back later, and turns golden when you use it on your own while explaining something completely different. That moment is the real goal.

The words climb through five levels of difficulty, so they are never too obvious and never out of reach.

## Game on the outside, learning on the inside

A few design choices I care about:

- **No school vocabulary.** No "questions", "marks" or "tasks". There are trophies, coins, a road of planets to travel and a character to befriend. I borrowed ideas from games my son already loves, and avoided the nastier ones: trophies are never taken away.
- **You compete with yourself.** Scores track progress against your own earlier answers, not against other people.
- **Speech is never penalised for how it sounds.** The game listens to what you say and how you structure it, not your accent, and English game terms are perfectly fine.
- **One thing at a time.** One tip per round, one focus per session.
- **Nothing hidden.** Recordings are saved, and the player knows it and can listen back, as can parents.
- **Privacy first.** It is a child's voice, so I only use services that do not train on it, and the language model only sees pseudonymised transcripts.

## Under the hood

ZibZib is two small pieces joined by an HTTP API: a Python FastAPI engine that handles speech-to-text, text-to-speech, grading and storage, and a React single-page app that deals with the microphone and the UI. Azure Speech turns speech into text, keeping the "ehm"s and restarts rather than cleaning them up, and Claude grades each answer against a rubric and writes the feedback. It runs on the same small server as [Whatevernote](https://www.whatevernote.com).

## What I have learned so far

Making the game fun comes first. If the loop is not something a ten-year-old wants to do again, nothing else matters, so I built the narrow speaking loop before any of the rewards and economy around it. The surprise has been how much of the value comes from the humour: an alien that "doesn't get it" is a much better listener than a grown-up with a rubric.

You can try it at [zibzib.it](https://zibzib.it). It is built for my family, so it is rough in places, but I would love to hear what you think.
