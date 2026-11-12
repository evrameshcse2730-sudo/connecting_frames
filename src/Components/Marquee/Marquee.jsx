import { Fragment } from "react";
import "./Marquee.css";

export default function Marquee({ items }) {
  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {[0, 1].map((loop) => (
          <div className="marquee-group" key={loop} aria-hidden={loop === 1}>
            {items.map((item, i) => (
              <Fragment key={i}>
                <span>{item}</span>
                <span className="marquee-dot">✦</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
