import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrgContent } from '@/types';
import { getOrgContent, updateOrgContent, createOrgContent } from '@/services/api/orgContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, PlusCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const contentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  video_url: z.string(),
  mission_statement: z.string().optional(),
  vision: z.string().optional(),
  history: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;

export const OrgContentManager: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  
  const { data: orgContent, isLoading } = useQuery({
    queryKey: ['org-content'],
    queryFn: getOrgContent,
  });
  
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
      mission_statement: '',
      vision: '',
      history: '',
      is_active: true,
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<OrgContent> }) => 
      updateOrgContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-content'] });
      toast({
        title: t('common.success'),
        description: t('common.savedSuccessfully'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('common.somethingWentWrong'),
        variant: 'destructive',
      });
    }
  });
  
  const createMutation = useMutation({
    mutationFn: (data: Omit<OrgContent, 'id' | 'created_at' | 'updated_at'>) => 
      createOrgContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-content'] });
      setIsCreateMode(false);
      toast({
        title: t('common.success'),
        description: t('common.createdSuccessfully'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('common.somethingWentWrong'),
        variant: 'destructive',
      });
    }
  });
  
  const handleSelectContent = (content: OrgContent) => {
    setSelectedContentId(content.id);
    form.reset({
      title: content.title,
      description: content.description,
      video_url: content.video_url,
      mission_statement: content.mission_statement,
      vision: content.vision,
      history: content.history,
      is_active: content.is_active,
    });
    setIsCreateMode(false);
  };
  
  const handleNewContent = () => {
    setSelectedContentId(null);
    form.reset({
      title: '',
      description: '',
      video_url: '',
      mission_statement: '',
      vision: '',
      history: '',
      is_active: true,
    });
    setIsCreateMode(true);
  };
  
  const onSubmit = (data: ContentFormValues) => {
    if (isCreateMode) {
      createMutation.mutate(data);
    } else if (selectedContentId) {
      updateMutation.mutate({ id: selectedContentId, data });
    }
  };
  
  const isSubmitting = updateMutation.isPending || createMutation.isPending;
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isCreateMode 
            ? t('dashboard.createOrgContent') 
            : selectedContentId 
              ? t('dashboard.editOrgContent') 
              : t('dashboard.orgContentManager')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.orgContentDescription')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!selectedContentId && !isCreateMode ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{t('dashboard.existingContent')}</h3>
              <Button 
                onClick={handleNewContent}
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                {t('dashboard.createNew')}
              </Button>
            </div>
            
            {orgContent && orgContent.length > 0 ? (
              <div className="grid gap-4">
                {orgContent.map(content => (
                  <Card 
                    key={content.id} 
                    className={`cursor-pointer hover:border-primary/50 transition-colors ${
                      content.is_active ? 'border-green-500/50 bg-green-50 dark:bg-green-900/10' : ''
                    }`}
                    onClick={() => handleSelectContent(content)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{content.title}</CardTitle>
                        {content.is_active && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            {t('common.active')}
                          </span>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {content.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('common.noData')}</p>
              </div>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.title')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.description')}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('dashboard.orgMainDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.videoUrl')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="/home-video.mp4" 
                      />
                    </FormControl>
                    <FormDescription>
                      {t('dashboard.videoUrlDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mission_statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.missionStatement')}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.vision')}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('dashboard.history')}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">{t('common.active')}</FormLabel>
                    <FormDescription className="ml-2">
                      {t('dashboard.activeContentHelp')}
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateMode(false);
                    setSelectedContentId(null);
                  }}
                  disabled={isSubmitting}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-1"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                  <Save className="h-4 w-4 mr-1" />
                  {t('common.save')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgContentManager;
