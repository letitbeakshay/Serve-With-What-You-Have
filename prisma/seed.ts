import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Three sample stories so /stories and the homepage's "what this looks
// like" section have real content to render. Hero images are the
// brand-pattern placeholders under public/stories/<slug>/hero.jpg.
const TWO_BAGS_BODY = `
<p>The bags had been at the bottom of the almirah for so long that Priya had stopped seeing them. Clothes her children had grown out of, a couple of bedsheets from a set that had lost its pair, two sweaters bought for a Ooty trip and worn exactly once.</p>
<p>Every few months she would notice them again, usually while looking for something else, and think that she really should do something about it. Then the thought would pass. She was not unwilling. She simply did not know where they should go, and finding out felt like a task she would need a free morning for.</p>
<h2>What actually stopped her</h2>
<p>When we asked her about it afterwards, she was clear that time was never really the problem. <strong>The problem was not knowing whether anyone wanted what she had.</strong></p>
<p>She had heard that some places only take new clothes. She had heard that others are particular about condition. She did not want to arrive with two bags and be told, politely, that they could not use any of it. So the bags stayed where they were.</p>
<blockquote><p>I kept thinking I would sort it out properly one day. Buy new things and give those instead. That day was not coming.</p><cite>Priya, on the year the bags spent in the cupboard</cite></blockquote>
<h2>What changed</h2>
<p>She told us what she had. Children's clothes, mostly cotton, sizes roughly five to nine years. Two bedsheets. Two sweaters. She mentioned her area, and that she could go on a weekday afternoon.</p>
<p>We already knew of a small home about eight minutes from her, one that had told us the week before that they were short on clothes for the younger children and could take cotton in exactly that size range. So we put the two of them in touch, and Priya spoke to the warden herself.</p>
<p>They agreed on a Thursday afternoon. She washed everything, folded it, and drove over. The whole thing, from the phone call to walking back out of their gate, took less than an hour.</p>
<h2>The part she did not expect</h2>
<p>The warden walked her through the building. Not as a tour, just because Priya was there and it was a quiet afternoon. She met four of the children. One of them was wearing a shirt that had come in from someone else the previous month.</p>
<p>She has been back twice since, once with a friend's clothes and once with school bags. She has not bought anything new to give. <strong>She has not needed to.</strong></p>
<p>There is nothing remarkable in this story, and that is the point of putting it here. Nobody raised money. Nobody organised a drive. Somebody had two bags in a cupboard, somebody eight minutes away needed what was in them, and the only thing missing was that the two of them had never met.</p>
`.trim();

const SPREADSHEETS_BODY = `
<p>Arjun spends most of his working day in the same handful of spreadsheets. Formulas, pivot tables, the kind of Excel that most people learn by being thrown into it. It had never once occurred to him that this was something he could give away, because it did not feel like a skill so much as just his job.</p>
<p>He mentioned it once, half joking, in his apartment complex's WhatsApp group when someone was venting about a job application that wanted "advanced Excel" on the résumé. A neighbour replied within minutes asking if he was serious.</p>
<h2>What he almost didn't do</h2>
<p>His first instinct was to say no. <strong>He assumed teaching meant a classroom, a syllabus, something formal he wasn't qualified to run.</strong> He is an accountant, not a trainer, and the gap between those two things felt large enough to talk himself out of it.</p>
<p>What actually got asked of him was much smaller: one call, one hour, on whatever the two of them were stuck on that week.</p>
<blockquote><p>I kept picturing a classroom. What they actually needed was someone to share their screen with for an hour.</p><cite>Arjun, on why he almost said no</cite></blockquote>
<h2>What changed</h2>
<p>Two people in the building were job hunting, and both had been shortlisted for roles that listed spreadsheet skills as a requirement, despite having barely opened one. Arjun offered a single Sunday evening call to walk through the basics. That call became a second one the following week, because there was more they wanted to cover.</p>
<p>It is still going three months later. Sometimes it is fifteen minutes on one formula. Sometimes it runs long because they have started bringing their own practice files to work through together.</p>
<h2>Small enough to keep doing</h2>
<p>One of the two has since been hired, in a role that used exactly what they had practised. She still joins the Sunday calls, now helping explain things to the other person from the other side of the same table she was sitting at three months ago.</p>
<p>Arjun still thinks of it as an odd thing to call "serving." <strong>It is an hour of something he already does all day, for free, on a call he would otherwise not have made.</strong></p>
`.trim();

const BLOOD_CAMP_BODY = `
<p>Ravi had been meaning to give blood for about five years. Not in a vague, someday sense, but in the specific way where every time a shortage came up in the news, he would think "I should actually do that" and then not do it.</p>
<p>It was never a fear of needles, and it was never really about being busy. <strong>He simply did not know where a reliable camp was, or whether he would even be told he was eligible once he got there.</strong> Both of those felt like questions worth answering before he showed up somewhere.</p>
<h2>What was actually stopping him</h2>
<p>A hospital felt like the wrong place to just walk into. Camps, when he heard about them at all, were usually mentioned after they had already happened. So the intention kept resetting to zero every few months, no closer to becoming an afternoon than it had been the year before.</p>
<blockquote><p>I didn't need convincing. I needed someone to tell me where and when, before it was already over.</p><cite>Ravi, on the five years in between</cite></blockquote>
<h2>What changed</h2>
<p>A neighbourhood group he is part of shared that a camp was being run at the school two streets from his house, on a Saturday morning, organised with a licensed blood bank. He had nothing else planned, so he walked over.</p>
<p>Registration, a short health check, the donation itself, and tea afterward. The whole thing took forty five minutes, most of which was paperwork and waiting rather than anything to do with the needle he had been quietly dreading for five years.</p>
<h2>What he did with it after</h2>
<p>He is now on the camp organiser's list to be messaged before the next one. He has already mentioned it to two colleagues, both of whom had a version of the same five year old intention sitting untouched.</p>
<p><strong>Nothing about what he gave was rare.</strong> What had been missing the whole time was simply knowing where to be.</p>
`.trim();

async function main() {
  // A single test form to exercise the public form and admin panel while
  // building. Real forms get created from the admin panel once step 6 exists.
  await prisma.form.upsert({
    where: { slug: "test" },
    update: {},
    create: {
      name: "Test Form",
      slug: "test",
      status: "OPEN",
    },
  });
  console.log("Seeded: /f/test");

  await prisma.story.upsert({
    where: { slug: "two-bags-that-sat-in-a-cupboard" },
    update: {},
    create: {
      slug: "two-bags-that-sat-in-a-cupboard",
      title: "Two bags that sat in a cupboard",
      tags: ["Clothes", "One afternoon", "Coimbatore"],
      heroImagePath: "/stories/two-bags-that-sat-in-a-cupboard/hero.jpg",
      heroImageWidth: 1600,
      heroImageHeight: 900,
      heroCaption: "The sorting took longer than the trip did.",
      standfirst:
        "Clothes nobody had worn in over a year, carried to a home eight minutes away. She had been meaning to do it since the last Deepavali.",
      authorName: "Priya N",
      authorInitials: "PN",
      publishedAt: new Date("2026-08-20T09:00:00Z"),
      bodyHtml: TWO_BAGS_BODY,
      facts: [
        { value: "2 bags", label: "Clothes and a few bedsheets" },
        { value: "8 minutes", label: "From her gate to theirs" },
        { value: "Zero rupees", label: "Nothing was spent" },
      ],
      gave: {
        label: "What Priya gave",
        subtext: "She used one square. There were eight available to her.",
        squares: ["money", "given", "unused", "unused", "unused", "unused", "unused", "unused", "unused"],
        primaryTag: "Clothes",
      },
      ctaHeading: "You have something in a cupboard too.",
      ctaText:
        "Tell us what it is and roughly where you are. If someone near you needs it, we will put the two of you in touch.",
      relatedSlugs: ["one-hour-a-week-on-spreadsheets", "the-camp-that-was-down-the-road"],
    },
  });

  await prisma.story.upsert({
    where: { slug: "one-hour-a-week-on-spreadsheets" },
    update: {},
    create: {
      slug: "one-hour-a-week-on-spreadsheets",
      title: "One hour a week, on spreadsheets",
      tags: ["A skill", "Weekly", "Bengaluru"],
      heroImagePath: "/stories/one-hour-a-week-on-spreadsheets/hero.jpg",
      heroImageWidth: 1600,
      heroImageHeight: 900,
      heroCaption: "The lesson happens over a video call, laptop propped on a stack of books.",
      standfirst:
        "An accountant who spends every day in Excel anyway, now spending one hour of it teaching two people who are job hunting how to use it.",
      authorName: "Arjun R",
      authorInitials: "AR",
      publishedAt: new Date("2026-08-27T09:00:00Z"),
      bodyHtml: SPREADSHEETS_BODY,
      facts: [
        { value: "2 people", label: "Learning spreadsheets with him" },
        { value: "1 hour", label: "Every Sunday evening" },
        { value: "3 months", label: "And still going" },
      ],
      gave: {
        label: "What Arjun gave",
        subtext: "He used one square. There were eight available to him.",
        squares: ["money", "unused", "unused", "unused", "given", "unused", "unused", "unused", "unused"],
        primaryTag: "A skill",
      },
      ctaHeading: "You already know something someone else doesn't.",
      ctaText:
        "Tell us what it is and how much time you have. If someone nearby is trying to learn it, we will put the two of you in touch.",
      relatedSlugs: ["two-bags-that-sat-in-a-cupboard", "the-camp-that-was-down-the-road"],
    },
  });

  await prisma.story.upsert({
    where: { slug: "the-camp-that-was-down-the-road" },
    update: {},
    create: {
      slug: "the-camp-that-was-down-the-road",
      title: "The camp that was down the road",
      tags: ["Blood", "45 minutes", "Madurai"],
      heroImagePath: "/stories/the-camp-that-was-down-the-road/hero.jpg",
      heroImageWidth: 1600,
      heroImageHeight: 900,
      heroCaption: "The camp was set up in a school hall two streets from his house.",
      standfirst:
        "A five year old intention to give blood, finally acted on because someone said exactly where and when.",
      authorName: "Ravi T",
      authorInitials: "RT",
      publishedAt: new Date("2026-09-03T09:00:00Z"),
      bodyHtml: BLOOD_CAMP_BODY,
      facts: [
        { value: "1 unit", label: "Roughly what one person gives" },
        { value: "45 minutes", label: "Door to door, including the form" },
        { value: "5 years", label: "Since he first meant to" },
      ],
      gave: {
        label: "What Ravi gave",
        subtext: "He used one square. There were eight available to him.",
        squares: ["money", "unused", "unused", "unused", "unused", "unused", "unused", "unused", "given"],
        primaryTag: "Blood",
      },
      ctaHeading: "You have five years of meaning to, too.",
      ctaText: "Find a licensed blood bank or camp running near you, and go this week instead of the next one.",
      relatedSlugs: ["two-bags-that-sat-in-a-cupboard", "one-hour-a-week-on-spreadsheets"],
    },
  });
  console.log("Seeded: 3 sample stories");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
