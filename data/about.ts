export interface FavoriteRead {
  title: string;
  creator?: string;
  url?: string;
  summary?: string;
}

export interface LifeAdvice {
  text: string;
}

export const about = {
  intro:
    "I’m Will Reynoir—a writer, builder, and lifelong wanderer of ideas. I spend my days exploring how the world works, why people do what they do, and what we can create when ambition meets curiosity. Whether through essays, startups, or community projects, I try to leave things a little better, a little clearer, and a little more interesting than I found them.",
  paragraphs: [
    "I was born and raised in New Orleans, a city that shaped my love for culture, stories, and gathering people together. I’m someone who chases adventure—sometimes literally, like living in 12 Cities in 12 Months, and sometimes through quieter wonderings about politics, human nature, or why we build the systems we do. I love sports (especially the Saints, LSU, Tulane, Pelican, & Borussia Dortmund), writing & reading, some gaming, hosting events in Central Park, and finding meaning in the everyday. At my core, I’m an optimist who believes life gets better when you create your own lore and invite others into it.",
    "Today, I’m the Head of Operations at Votre, a crypto startup reimagining what a modern digital investment bank can be. I work across compliance, product, legal, strategy, investor relations, and launch execution—basically whatever it takes to turn ambitious ideas into reality. My background spans institutional crypto, business development, government, and a long history of being able to GSD (get S*** done).",
  ],
  favoriteReads: [
    {
      title: "Financial Nihilism",
      creator: "Travis Kling",
      url: "https://www.epsilontheory.com/a/financial-nihilism/",
      summary:
        "Explores the cultural malaise that sets in when markets are decoupled from fundamentals, policy feels arbitrary, and money stops meaningfully reflecting effort. Kling argues that the resulting nihilism explains both reckless speculation and a desire to build parallel systems."
    },
    {
      title: "The State of Culture, 2024",
      creator: "Ted Gioia",
      url: "https://substack.com/inbox/post/141676786",
      summary:
        "Gioia surveys the creative landscape and concludes that genuine culture is thriving in the margins while legacy gatekeepers obsess over financial engineering. The piece is both a warning about homogenized mainstream tastes and a celebration of the indie surge."
    },
    {
      title: "Build What’s Fundable",
      creator: "Kyle Harrison",
      url: "https://investing101.substack.com/p/build-whats-fundable",
      summary:
        "A pragmatic manifesto for founders: great ideas need to intersect with capital incentives, market timing, and believable execution plans. Harrison lays out how to tell the story investors need to hear without abandoning the soul of the product."
    },
    {
      title: "Here’s How to Live: Create",
      creator: "Derek Sivers",
      url: "https://sive.rs/htl23",
      summary:
        "The opening paragraphs distill a rule for living: produce more than you consume, and let creation be your compass. Sivers argues that making things is the surest path to meaning, autonomy, and a life that compounds in public."
    }
  ] as FavoriteRead[],
  approachToLife: [
    {
      text:
        "There’s a difference between being a nice guy and a good man. A nice guy will get along with people, don’t know what they stand for or against. A good man has ideals that they’ll stand for, and they’ll stand against, and when they are tested, a good man is not a nice guy. Be a good man."
    },
    {
      text: "Try to do something good every day"
    },
    {
      text:
        "You shouldn’t try to make yourself seem like the smartest one in the room to others; you should make those who talk to you feel like they are the smartest person in the room"
    },
    {
      text:
        "How can you trust someone with a secret if you’re not even able to keep it to yourself?"
    },
    {
      text: "When giving advice, don’t give answers but frameworks"
    },
    {
      text: "Be humble in your preparation and confident in your performance"
    },
    {
      text: "Success is being excited to go to work and being excited to come home."
    },
    {
      text:
        "Never trust a man who promises to do tomorrow what they had the power to do yesterday"
    },
    {
      text:
        "Work for the work itself, not for the money. Even better - find other people who also want to work for the work itself on something you are passionate about"
    }
  ] as LifeAdvice[],
};
