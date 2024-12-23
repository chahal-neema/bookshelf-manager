import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearchChange: (search: string) => void;
  onGenreChange: (genre: string) => void;
  onStatusChange: (status: string) => void;
  onRatingChange: (rating: string) => void;
}

export function SearchBar({
  onSearchChange,
  onGenreChange,
  onStatusChange,
  onRatingChange
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#42526E] h-4 w-4" />
        <Input
          placeholder="Search books..."
          className="pl-10 border-[#DFE1E6] text-[#172B4D] placeholder-[#7A869A] rounded-[3px]
            focus:border-[#4C9AFF] focus:ring-[#4C9AFF] focus:ring-1"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select onValueChange={onGenreChange}>
          <SelectTrigger className="w-[140px] border-[#DFE1E6] text-[#172B4D] rounded-[3px]
            focus:border-[#4C9AFF] focus:ring-[#4C9AFF] focus:ring-1">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="non-fiction">Non-fiction</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="sci-fi">Science Fiction</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px] border-[#DFE1E6] text-[#172B4D] rounded-[3px]
            focus:border-[#4C9AFF] focus:ring-[#4C9AFF] focus:ring-1">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onRatingChange}>
          <SelectTrigger className="w-[140px] border-[#DFE1E6] text-[#172B4D] rounded-[3px]
            focus:border-[#4C9AFF] focus:ring-[#4C9AFF] focus:ring-1">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}