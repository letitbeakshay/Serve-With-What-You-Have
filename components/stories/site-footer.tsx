import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div>
            <Link className="brand" href="/">
              <BrandMark />
              <b>Serve With What You Have</b>
            </Link>
            <p className="f-mission">
              We help people serve with what is already in their hands, by finding the people who need it and
              connecting the two.
            </p>
          </div>

          <div>
            <h4>Ways to serve</h4>
            <ul>
              <li>
                <Link href="/#ways">New Life to Old Clothes</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Initiative</h4>
            <ul>
              <li>
                <Link href="/#why">Why we exist</Link>
              </li>
              <li>
                <Link href="/#how">How it works</Link>
              </li>
              <li>
                <Link href="/#orgs">For organisations</Link>
              </li>
              <li>
                <Link href="/#faq">Questions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <a href="#">Terms of use</a>
              </li>
              <li>
                <a href="#">Disclaimer</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="f-bar">
          <p>&copy; 2026 Serve With What You Have</p>
          <p>
            Serve With What You Have is an independent community initiative. We connect people who want to serve
            with people who need help. We do not collect money, process payments, or take custody of anything you
            give.
          </p>
        </div>
      </div>
    </footer>
  );
}
