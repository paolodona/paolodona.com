---
title: Speaking at Stripe Sessions 2026 in San Francisco
date: 2026-04-30
slug: stripe-sessions-2026
summary: Sharing the blueprint we used at Staycity Group to unify our multi-channel payment infrastructure on stage at Stripe Sessions 2026 in San Francisco.
---

<div class="gallery">
	<a class="gallery__hero" href="/img/blog/stripe-sessions-2026/1.jpg" data-lightbox>
		<img src="/img/blog/stripe-sessions-2026/1.jpg" alt="Paolo on stage at Stripe Sessions 2026 — Staycity slide on the side screen">
	</a>
	<div class="gallery__row">
		<a href="/img/blog/stripe-sessions-2026/2.jpg" data-lightbox>
			<img src="/img/blog/stripe-sessions-2026/2.jpg" alt="Wide shot of the audience at Stripe Sessions 2026">
		</a>
		<a href="/img/blog/stripe-sessions-2026/3.jpg" data-lightbox>
			<img src="/img/blog/stripe-sessions-2026/3.jpg" alt="Paolo presenting an architecture slide">
		</a>
		<a href="/img/blog/stripe-sessions-2026/4.jpg" data-lightbox>
			<img src="/img/blog/stripe-sessions-2026/4.jpg" alt="Fireside discussion with James Lemon and Peter Hammer">
		</a>
	</div>
</div>

On 30 April 2026 I had the pleasure of speaking at **Stripe Sessions** in San Francisco, in a breakout titled *"Under one roof: unifying the guest experience"*, alongside [James Lemon](https://www.linkedin.com/in/james-lemon/) (Global GTM Lead, Hospitality and Travel at Stripe) and [Peter Hammer](https://www.linkedin.com/in/peterfhammer/) (Managing Director, Global Travel and Hospitality Industry Lead at Slalom).

The premise of the session was simple: **guests don't think in channels**. They book online, check in at a kiosk, order room service from their phone, and expect it all to feel like one experience. Yet on the operator side that one experience is normally stitched together from a dozen different systems — each with its own payment provider, its own reconciliation quirks, and its own way of breaking on a Saturday night.

I shared the blueprint we've been executing at Staycity Group to unify our multi-channel payment infrastructure across our 41 properties in 20+ cities across 8 European countries.

## What I covered

I started by setting the scene at Staycity six years ago: every channel — online checkout, front-desk and kiosk terminals, F&B POS, the reservations call centre — running on a different payment provider, with reconciliation that was painful at best and impossible at worst (especially for refunds), and conversion that varied wildly by market because we couldn't always offer the locally preferred payment method or currency.

We picked Stripe for four reasons that compound when you're operating across eight countries: a unified architecture across online, in-person and back-office; localised checkout that lets us switch on local payment methods and currencies as we expand; global scalability with local acquiring and built-in compliance; and deep technical integration with Oracle OPERA Cloud and Tevalis, our PMS and F&B POS.

The rollout was three stages. First we unified the financial infrastructure across our existing stack — online booking, the Stripe ↔ OPERA Cloud integration, and front-desk and kiosk terminals all at once, because refunds and stored cards are genuinely cross-channel. We started with a one-property POC and then deployed vertically across all 30 live properties in three months, with a single person running the rollout. Second, we turned on new payment methods market by market — Apple Pay, Google Pay, PayPal, iDEAL, Klarna, Revolut Pay and Link — and used the Stripe dashboard to A/B test where each one actually paid back. Third, and where we are now, we started layering in new revenue streams via the Stripe FX API for Multi-Currency Conversion: present prices in the guest's local currency, capture the FX margin that banks would otherwise take.

The headline numbers: 17% decrease in checkout abandonment, 10% increase in authorisation rates, improved ROAS on direct bookings, and over $1M in incremental revenue from multi-currency conversion. Next up we're looking at Pay by Bank for corporate stays.

The lesson I'd give anyone considering this: build the business case first. Model conversion uplift against payment-method commissions, factor in MCC and Pay-by-Bank, and don't forget efficiency gains from unified reconciliation. When you add it all up on a platform you can genuinely build on, the ROI case becomes clear very quickly.

## Reflections

The most rewarding part wasn't the 30 minutes on stage — it was the conversations afterwards with attendees. The level of curiosity, practical thinking, and creativity in the room really stood out. Several great exchanges on agentic commerce, on what loyalty looks like when AI agents do more of the booking, and on how to keep the physical guest experience unmistakably human as automation handles the menial bits.

Big thanks to James Lemon and Peter Hammer for being such generous co-panellists, to the Stripe team for the invitation and the meticulous preparation, and to everyone who took the time to engage, challenge ideas, and share perspectives. Definitely one of the more energising rooms I've been in this year.
