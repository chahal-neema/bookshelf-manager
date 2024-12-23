import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getProfile, updateProfile, uploadAvatar } from '@/services/profile';
import { profileSchema } from '@/lib/validations/profile';
import { useToast } from '@/hooks/use-toast';
import { UserCircle } from 'lucide-react';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      display_name: '',
      avatar_url: ''
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        if (profile) {
          form.reset({
            username: profile.username,
            display_name: profile.display_name || '',
            avatar_url: profile.avatar_url || ''
          });
        }
      } catch (error) {
        toast({
          title: 'Error loading profile',
          description: 'Failed to load your profile information',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (open) {
      loadProfile();
    }
  }, [open, form, toast]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);
      const url = await uploadAvatar(file);
      form.setValue('avatar_url', url);
      toast({
        title: 'Avatar updated',
        description: 'Your profile picture has been updated'
      });
    } catch (error) {
      toast({
        title: 'Error updating avatar',
        description: 'Failed to upload your profile picture',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  async function onSubmit(data: any) {
    try {
      setIsSaving(true);
      await updateProfile(data);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: 'Failed to update your profile',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={form.watch('avatar_url')} />
                <AvatarFallback>
                  <UserCircle className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={isSaving}
                >
                  Change Picture
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}