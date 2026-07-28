/* ──────────────────────────────────────────────
   Sample Meeting Transcript — Demo Data
   ────────────────────────────────────────────── */

export const sampleTranscript = `Project Status Meeting — Q3 Sprint Review
Date: Monday, July 28, 2026 at 10:00 AM
Attendees: Sarah Chen (PM), David Kim (Lead Dev), Maria Garcia (Designer), James Wilson (QA), Emily Patel (Backend)

---

Sarah Chen: Good morning everyone. Let's go through the sprint items. David, can you start with the API update?

David Kim: Sure. The REST API migration is about 80% done. I still need to finish the authentication endpoints by this Wednesday. The rate limiting module is also pending — I'll need Emily's help with the Redis integration.

Emily Patel: I can pair with you on the Redis setup tomorrow afternoon. I also wanted to flag that the database migration scripts need to be reviewed before we push to staging. Can someone from QA take a look at those?

James Wilson: I can review the migration scripts. When do you need that done by?

Emily Patel: Ideally by Thursday so we can run the staging deployment on Friday.

Sarah Chen: Perfect. James, please prioritize that. Maria, where are we with the dashboard redesign?

Maria Garcia: The new dashboard mockups are ready for review. I've uploaded them to Figma. I need feedback from the team by end of this week so I can finalize the designs. There's one open question about the analytics widget — should we show real-time data or daily summaries? I think we should schedule a quick 15-minute call to decide.

Sarah Chen: Good point. Let's schedule that call for Wednesday morning. I'll send out the invite. David, can you also prepare a technical feasibility assessment for the real-time analytics option?

David Kim: Yes, I'll put together a brief document. Should have it ready by Wednesday before the call.

Sarah Chen: Great. One more thing — we need to update the project documentation. It's getting outdated. James, can you take the lead on that? It doesn't have to be done immediately, but it would be nice to have it updated by the end of next sprint.

James Wilson: Sure, I'll start working on it when I have some bandwidth. Also, I wanted to mention that we have 3 critical bugs from the last release that need to be fixed urgently. I've tagged them in Jira. David and Emily, those should be your top priority this week.

Emily Patel: Noted. I'll look at the backend-related bugs today.

David Kim: I'll tackle the frontend bugs right after standup.

Sarah Chen: Alright, to summarize the key actions: David finishes auth endpoints by Wednesday, Emily and David pair on Redis tomorrow, James reviews migration scripts by Thursday, everyone reviews Maria's mockups by Friday, and we fix those critical bugs ASAP. Anything else?

Maria Garcia: Just a reminder that I need the brand assets from marketing. Sarah, could you follow up with them?

Sarah Chen: Will do. I'll ping the marketing team today. OK, great meeting everyone. Let's stay on track this week!`;

export default sampleTranscript;
