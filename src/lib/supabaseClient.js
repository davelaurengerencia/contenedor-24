import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://plblcqslnjrveyfnylka.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYmxjcXNsbmpydmV5Zm55bGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5NzEzNjYsImV4cCI6MjAyNDU0NzM2Nn0.1aKc19sGj7-hn2Ja63wDNBT-r4bYKErq4Hae9Nh8p2k')