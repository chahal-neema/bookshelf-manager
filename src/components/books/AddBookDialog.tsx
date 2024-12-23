import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addBook } from '@/services/books';
import { bookSchema } from '@/lib/validations/book';
import { useToast } from '@/hooks/use-toast';

export function AddBookDialog({ onBookAdded }: { onBookAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      coverUrl: '',
      status: 'unread'
    }
  });

  async function onSubmit(data: any) {
    try {
      await addBook(data);
      toast({
        title: 'Book added successfully',
        description: `${data.title} has been added to your library`
      });
      setOpen(false);
      form.reset();
      onBookAdded();
    } catch (error) {
      toast({
        title: 'Error adding book',
        description: 'There was a problem adding your book. Please try again.',
        variant: 'destructive'
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookPlus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fiction">Fiction</SelectItem>
                      <SelectItem value="non-fiction">Non-fiction</SelectItem>
                      <SelectItem value="mystery">Mystery</SelectItem>
                      <SelectItem value="sci-fi">Science Fiction</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter cover image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Book</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}