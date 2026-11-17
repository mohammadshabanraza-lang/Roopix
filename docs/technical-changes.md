# Technical changes

The latest implementation is documented in [`implementation-report.md`](implementation-report.md). The site keeps a static HTML/CSS/JavaScript architecture, preserves the existing shared navigation and animation framework, and uses a shared `assets/implementation.css` layer for the UX audit changes.

The retired bird-feeder image-sequence files and duplicate `exports/scroll-experience.js` file have been removed. The site does not implement 360-degree or product-rotation viewing.

The Exports enquiry form has five visible fields and continues to hand off to the visitor's email app or WhatsApp. It does not send data to a server.
