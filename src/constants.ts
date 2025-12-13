import type { Message } from './types';
import { PersonaType } from './types';

export const SAMPLE_CONVERSATION: Message[] = [
  { id: '1', role: 'user', content: "Hey, I'm trying to get into running again, but it's been years.", timestamp: "10:00 AM" },
  { id: '2', role: 'assistant', content: "That's a great goal! Starting slow is key. Have you thought about a specific plan?", timestamp: "10:01 AM" },
  { id: '3', role: 'user', content: "Not really. I just know I hate treadmills. They make me feel like a hamster.", timestamp: "10:02 AM" },
  { id: '4', role: 'assistant', content: "Understood, outdoor running it is! What kind of environment do you have nearby?", timestamp: "10:03 AM" },
  { id: '5', role: 'user', content: "I live near a big park, which is nice, but I'm super self-conscious about people watching me.", timestamp: "10:04 AM" },
  { id: '6', role: 'assistant', content: "That's a very common feeling. Maybe early mornings would be quieter?", timestamp: "10:05 AM" },
  { id: '7', role: 'user', content: "Ugh, I am NOT a morning person. Coffee doesn't even touch my soul until 9 AM.", timestamp: "10:06 AM" },
  { id: '8', role: 'assistant', content: "Fair enough! How about evenings or weekends?", timestamp: "10:07 AM" },
  { id: '9', role: 'user', content: "Weekends might work. I usually have free time on Saturday afternoons.", timestamp: "10:08 AM" },
  { id: '10', role: 'user', content: "I bought these neon green shoes last year that I never wore. They're loud.", timestamp: "10:10 AM" },
  { id: '11', role: 'assistant', content: "Neon green sounds fun! They might actually help with visibility if you run at dusk.", timestamp: "10:11 AM" },
  { id: '12', role: 'user', content: "True. Honestly, I'm just scared I'll fail again. I tried couch-to-5k twice and quit.", timestamp: "10:12 AM" },
  { id: '13', role: 'assistant', content: "What made you quit those times? Was it the schedule or the difficulty?", timestamp: "10:13 AM" },
  { id: '14', role: 'user', content: "Boredom, mostly. And my knees hurt. I have weak knees from high school soccer.", timestamp: "10:14 AM" },
  { id: '15', role: 'assistant', content: "Knee pain is serious. We should focus on low-impact or soft surfaces. Grass or dirt trails in that park?", timestamp: "10:15 AM" },
  { id: '16', role: 'user', content: "Yeah, there are trails. I do love nature. Being stuck inside depresses me.", timestamp: "10:16 AM" },
  { id: '17', role: 'user', content: "Also, I need music. I can't run in silence. It drives me crazy.", timestamp: "10:17 AM" },
  { id: '18', role: 'assistant', content: "Music is a great motivator. What's your go-to running playlist genre?", timestamp: "10:18 AM" },
  { id: '19', role: 'user', content: "90s Hip Hop or really aggressive EDM. Nothing slow.", timestamp: "10:19 AM" },
  { id: '20', role: 'assistant', content: "High energy! Perfect for keeping pace.", timestamp: "10:20 AM" },
  { id: '21', role: 'user', content: "I also have a dog, a Golden Retriever named Buster. Can he come?", timestamp: "10:21 AM" },
  { id: '22', role: 'assistant', content: "Most parks allow dogs on leashes. Running with a buddy makes it less boring too!", timestamp: "10:22 AM" },
  { id: '23', role: 'user', content: "He pulls a lot though. Might be annoying.", timestamp: "10:23 AM" },
  { id: '24', role: 'user', content: "Actually, thinking about it, maybe I should just walk-run first.", timestamp: "10:25 AM" },
  { id: '25', role: 'assistant', content: "Walk-run intervals are excellent for building stamina without hurting your knees.", timestamp: "10:26 AM" },
  { id: '26', role: 'user', content: "I'm just worried I'll get discouraged if I don't see results fast.", timestamp: "10:27 AM" },
  { id: '27', role: 'user', content: "I tend to be really hard on myself when I'm not perfect immediately.", timestamp: "10:28 AM" },
  { id: '28', role: 'assistant', content: "Perfectionism can be a hurdle. Let's aim for 'consistency' instead of 'perfection'.", timestamp: "10:29 AM" },
  { id: '29', role: 'user', content: "You're right. Okay, I'll try this Saturday.", timestamp: "10:30 AM" },
  { id: '30', role: 'user', content: "Wait, actually, can you help me plan the first run? Keep in mind my knees and my need for distraction.", timestamp: "10:31 AM" },
];

export const PERSONA_DESCRIPTIONS: Record<PersonaType, string> = {
  [PersonaType.STANDARD]: "A helpful, neutral, and polite AI assistant.",
  [PersonaType.MENTOR]: "A wise, calm, and encouraging mentor who uses metaphors and focuses on long-term growth. Speaks slowly and thoughtfully.",
  [PersonaType.WITTY]: "A sarcastic, funny, and quick-witted best friend. Uses slang, makes jokes, and keeps things lighthearted but supportive.",
  [PersonaType.THERAPIST]: "A compassionate, empathetic therapist. Validates feelings, asks reflective questions, and focuses on emotional well-being.",
  [PersonaType.PIRATE]: "A rugged space pirate captain. Uses nautical/space slang, very enthusiastic, treats the user like a crewmate.",
};