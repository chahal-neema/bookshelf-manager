import { useContext } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { SearchBar } from '@/components/filters/SearchBar';
import { Sidebar } from '@/components/filters/Sidebar';
import { BookGrid } from '@/components/books/BookGrid';
import { useBookFilters } from '@/hooks/useBookFilters';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useBooks } from '@/hooks/useBooks';
import { AuthContext } from '@/lib/auth';
import { LoginPage } from '@/components/auth/LoginPage';

export default function App() {
  const { user } = useContext(AuthContext);
  const { books, loading, refetch } = useBooks();
  const {
    filters,
    filteredBooks,
    updateSearch,
    updateGenres,
    updateStatus,
    updateRating,
    updateLoanStatus
  } = useBookFilters(books);

  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <TopNav onBookAdded={refetch} />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar 
          onSearchChange={updateSearch}
          onGenreChange={(genre) => updateGenres(genre === 'all' ? [] : [genre])}
          onStatusChange={(status) => updateStatus(status === 'all' ? [] : [status])}
          onRatingChange={(rating) => updateRating(rating === 'all' ? null : Number(rating))}
        />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="w-full lg:w-64 shrink-0">
            <Sidebar 
              onStatusChange={updateStatus}
              onGenreChange={updateGenres}
              onRatingChange={updateRating}
              onLoanStatusChange={updateLoanStatus}
              selectedFilters={filters}
              books={books}
            />
          </aside>
          <main className="flex-1 min-w-0">
            <BookGrid books={filteredBooks} onUpdate={refetch} />
          </main>
        </div>
      </div>
    </div>
  );
}