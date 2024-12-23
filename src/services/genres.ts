import { supabase } from '@/lib/supabase';

export async function getOrCreateGenre(genreName: string): Promise<string> {
  const normalizedName = genreName.toLowerCase().trim();

  // Try to get existing genre
  const { data: genre, error: fetchError } = await supabase
    .from('genres')
    .select('id')
    .ilike('name', normalizedName)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching genre:', fetchError);
    throw fetchError;
  }

  if (genre) {
    return genre.id;
  }

  // Create new genre if it doesn't exist
  const { data: newGenre, error: createError } = await supabase
    .from('genres')
    .insert({ name: normalizedName })
    .select('id')
    .single();

  if (createError) {
    console.error('Error creating genre:', createError);
    throw createError;
  }

  return newGenre.id;
}