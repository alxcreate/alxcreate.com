import React from 'react';
import Layout from '@theme/Layout';
import styles from './books.module.css';

const books = [
  {
    title: 'IPv6 Network Administration',
    authors: 'Niall Richard Murphy, David Malone',
    year: '2005',
    genre: 'Networking / Infrastructure',
    summary:
      'A practical guide to planning, deploying, and operating IPv6 in real networks, with a focus on addressing, routing, DNS, and migration from IPv4.',
    highlights: ['Addressing', 'Routing', 'DNS'],
    coverTone: 'coverBlue',
  },
  {
    title: 'Managing Humans',
    authors: 'Michael Lopp',
    year: '2007',
    genre: 'Leadership / Engineering Management',
    summary:
      'A candid and often humorous book about managing engineers, nerds, and geeks while building healthy teams and making better leadership decisions.',
    highlights: ['Engineering Management', 'Team Dynamics', 'Leadership'],
    coverTone: 'coverOrange',
  },
  {
    title: 'Time Management for System Administrators',
    authors: 'Thomas A. Limoncelli',
    year: '2005',
    genre: 'Professional Development / IT Operations',
    summary:
      'A practical book for engineers and administrators on handling interruptions, prioritization, routine work, and automation without losing control of the day.',
    highlights: ['Cycle System', 'Interruptions', 'Automation'],
    coverTone: 'coverGreen',
  },
  {
    title: 'The Practice of System and Network Administration, Third Edition',
    authors: 'Thomas A. Limoncelli, Christina J. Hogan, Strata R. Chalup',
    year: '2016',
    genre: 'Systems Administration / Operations',
    summary:
      'A broad field guide to running modern IT infrastructure, covering support, change management, monitoring, automation, and service reliability.',
    highlights: ['Operations', 'Change Management', 'Monitoring'],
    coverTone: 'coverPurple',
  },
  {
    title: 'The Phoenix Project',
    authors: 'Gene Kim, Kevin Behr, George Spafford',
    year: '2013',
    genre: 'Business Novel / DevOps',
    summary:
      'A story about a failing IT initiative that makes DevOps principles, bottlenecks, and flow of work easy to understand through narrative.',
    highlights: ['The Three Ways', 'Theory of Constraints', 'Work in Progress'],
    coverTone: 'coverBlue',
  },
  {
    title: 'Cloud Native DevOps with Kubernetes',
    authors: 'John Arundel, Justin Domingos',
    year: '2019',
    genre: 'DevOps / Kubernetes',
    summary:
      'A hands-on guide to applying DevOps practices in Kubernetes environments, from containers and deployment pipelines to observability and security.',
    highlights: ['Kubernetes', 'CI/CD', 'Cloud Native'],
    coverTone: 'coverOrange',
  },
  {
    title: 'The DevOps Handbook',
    authors: 'Gene Kim, Jez Humble, Patrick Debois, John Willis',
    year: '2016',
    genre: 'DevOps / IT Management',
    summary:
      'A practical framework for improving how organizations build, deploy, and operate software by connecting culture, automation, measurement, and sharing.',
    highlights: ['CALMS', 'Flow', 'Continuous Improvement'],
    coverTone: 'coverGreen',
  },
  {
    title: 'Site Reliability Engineering: How Google Runs Production Systems',
    authors: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy',
    year: '2016',
    genre: 'Reliability / Operations',
    summary:
      'A foundational SRE book on how Google runs production systems, covering service ownership, toil reduction, incident response, and reliability engineering principles.',
    highlights: ['SRE', 'Toil Reduction', 'Incident Response'],
    coverTone: 'coverPurple',
  },
  {
    title: 'Securing DevOps: Security in the Cloud',
    authors: 'Julien Vehent',
    year: '2018',
    genre: 'Security / DevOps',
    summary:
      'A security-focused guide to embedding protection into infrastructure, delivery pipelines, cloud platforms, and team processes without slowing delivery down.',
    highlights: ['Threat Modeling', 'Cloud Security', 'Automation'],
    coverTone: 'coverBlue',
  },
];

function BookCard({book}) {
  return (
    <article className={styles.card}>
      <div className={`${styles.cover} ${styles[book.coverTone]}`}>
        <span className={styles.coverLabel}>Book</span>
        <h2>{book.title}</h2>
        <p>{book.authors}</p>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span>{book.year}</span>
          <span>{book.genre}</span>
        </div>
        <p className={styles.summary}>{book.summary}</p>
        <ul className={styles.highlights} aria-label={`Key topics in ${book.title}`}>
          {book.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function BooksPage() {
  return (
    <Layout
      title="Books"
      description="A curated collection of IT, DevOps, SRE, and infrastructure books on one page."
    >
      <main className={styles.page}>
        <section className="container">
          <header className={styles.hero}>
            <p className={styles.eyebrow}>Library</p>
            <h1>Books</h1>
            <p className={styles.lead}>
              A curated collection of technical books shown as tiles with a cover,
              concise description, and key topics on a single page.
            </p>
          </header>

          <div className={styles.grid}>
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
