import React from 'react';
import Layout from '@theme/Layout';
import styles from './books.module.css';

const books = [
  {
    title: 'The Phoenix Project',
    authors: 'Gene Kim, Kevin Behr, George Spafford',
    year: '2013',
    genre: 'Business Novel / DevOps',
    summary:
      'История про кризисный IT-проект, через которую наглядно объясняются базовые принципы DevOps, ограничения системы и работа с потоком задач.',
    highlights: ['The Three Ways', 'Theory of Constraints', 'Work in Progress'],
    coverTone: 'coverBlue',
  },
  {
    title: 'Time Management for System Administrators',
    authors: 'Thomas A. Limoncelli',
    year: '2005',
    genre: 'Professional Development / IT Operations',
    summary:
      'Практическая книга для инженеров и администраторов о том, как работать с прерываниями, приоритетами, рутиной и не терять время на повторяющиеся задачи.',
    highlights: ['Cycle System', 'Interruptions', 'Automation'],
    coverTone: 'coverOrange',
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
      description="Подборка книг по IT и смежным темам на одной странице."
    >
      <main className={styles.page}>
        <section className="container">
          <header className={styles.hero}>
            <p className={styles.eyebrow}>Books</p>
            <h1>Книги</h1>
            <p className={styles.lead}>
              Подборка технических книг в формате плиток: обложка, краткая информация и
              ключевые темы на одной странице.
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
