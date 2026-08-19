export const metadata = {
  title: "Privacy policy | Serve With What You Have",
};

const LAST_UPDATED = "20 August 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-xl px-6 py-16">
      <h1 className="font-heading text-xl font-semibold text-foreground">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {LAST_UPDATED}</p>

      <p className="mt-6 text-muted-foreground">
        This page explains what happens to the information an organisation shares with us
        through our onboarding form.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">What we collect</h2>
          <p className="mt-2 text-muted-foreground">
            When an organisation fills in our form, we collect what they choose to share:
            organisation name and type, registration details, location, the contact
            person&apos;s name, role and phone number, how many people they support, what kind of
            support they can receive, and any website or social links they give us.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Why we collect it</h2>
          <p className="mt-2 text-muted-foreground">
            We use it to understand the organisation and to confirm the details by phone before
            anything is shared further. If the organisation agrees, we also use it so people who
            want to help can find and contact them directly.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            What we do not do
          </h2>
          <p className="mt-2 text-muted-foreground">
            Serve With What You Have does not collect money, does not handle donated items, and
            does not act on behalf of any organisation. We do not sell this information, and we do
            not use analytics tools or trackers on this form.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Who can see it</h2>
          <p className="mt-2 text-muted-foreground">
            Responses are stored in our database and are only visible to the person who runs
            Serve With What You Have, behind a private login. Details an organisation agrees to
            make public may be shown on the site so people can reach out to them directly.
            Everything else stays private.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Your choices</h2>
          <p className="mt-2 text-muted-foreground">
            If your organisation&apos;s details change, or you would like something updated or
            removed, get in touch with whoever invited you to fill in this form and we will sort
            it out.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Changes to this policy
          </h2>
          <p className="mt-2 text-muted-foreground">
            If this policy changes in a way that matters, we will update the date at the top of
            this page.
          </p>
        </section>
      </div>
    </main>
  );
}
