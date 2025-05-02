
import React from 'react';
import { Program } from '@/types';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  X, 
  MapPin
} from 'lucide-react';

interface ProgramDetailsModalProps {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
}

const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  program,
  isOpen,
  onClose,
}) => {
  const { t, direction } = useLanguage();
  
  // Check if program has these optional properties before accessing them
  const hasImageUrl = 'image_url' in program && program.image_url;
  const hasLocation = 'location' in program && program.location;
  const hasCapacity = 'capacity' in program && program.capacity !== undefined;
  const hasDetailsUrl = 'details_url' in program && program.details_url;

  // Fallback function for missing properties
  const getImageUrl = () => {
    return hasImageUrl ? program.image_url : '/placeholder.svg';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0" 
        dir={direction}
      >
        {/* Header with background image */}
        <div className="relative h-48 bg-cover bg-center" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${getImageUrl()})` 
          }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          
          {/* Program title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-2">
              {program.name}
            </h2>
            <div className="flex items-center text-white/80 text-sm gap-2">
              <Calendar size={16} />
              <span>{program.date}</span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div>
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  {t('programs.details')}
                </h3>
                
                <div className="space-y-4">
                  {/* Date and time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-1 text-ogec-primary" />
                    <div>
                      <div className="font-semibold">
                        {t('programs.dateAndTime')}
                      </div>
                      <div className="text-muted-foreground">
                        {program.date}
                      </div>
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-1 text-ogec-primary" />
                    <div>
                      <div className="font-semibold">
                        {t('programs.duration')}
                      </div>
                      <div className="text-muted-foreground">
                        {program.duration} {t('programs.hours')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  {hasLocation && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 text-ogec-primary" />
                      <div>
                        <div className="font-semibold">
                          {t('programs.location')}
                        </div>
                        <div className="text-muted-foreground">
                          {program.location}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Capacity */}
                  {hasCapacity && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 mt-1 text-ogec-primary" />
                      <div>
                        <div className="font-semibold">
                          {t('programs.capacity')}
                        </div>
                        <div className="text-muted-foreground">
                          {program.capacity} {t('programs.people')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {/* Right column */}
            <div>
              <Card className="p-4 mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  {t('programs.description')}
                </h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {program.description}
                </p>
              </Card>
              
              {/* Additional details link if available */}
              {hasDetailsUrl && (
                <div className="mt-4">
                  <Button 
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => window.open(program.details_url, '_blank')}
                  >
                    <FileText size={18} />
                    {t('programs.viewDetailsDocument')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailsModal;
