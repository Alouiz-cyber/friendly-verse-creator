
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Program } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, Clock, Tag, FileText, 
  CheckCircle, Layers, User, Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
}

const ProgramDetailsModal: React.FC<Props> = ({ open, onOpenChange, program }) => {
  const { t } = useLanguage();
  
  if (!program) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return t('general.notAvailable', ['N/A']);
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  // Determine status color
  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    switch(status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('programs.details', ['Program Details'])}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Program Header */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="text-xl font-bold">{program.title}</h3>
            
            {program.status && (
              <div className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {program.status}
              </div>
            )}
            
            <div className="mt-3 text-muted-foreground">
              <p className="line-clamp-3">{program.description || t('programs.noDescription', ['No description provided'])}</p>
            </div>
          </div>
          
          {/* Program Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="text-md font-semibold border-b pb-2">{t('programs.mainDetails', ['Main Details'])}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.date', ['Date Range'])}</p>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <p>{formatDate(program.start_date)} - </p>
                      <p>{formatDate(program.end_date)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.time', ['Time'])}</p>
                    <p>{program.horaire || t('general.notAvailable', ['N/A'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.type', ['Type'])}</p>
                    <p className="capitalize">{program.type_activite?.replace('_', ' ') || t('general.notAvailable', ['N/A'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.activity', ['Activity'])}</p>
                    <p>{program.activite || t('general.notAvailable', ['N/A'])}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="text-md font-semibold border-b pb-2">{t('programs.organization', ['Organization Information'])}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.organizer', ['Organizer'])}</p>
                    <p>{program.organizer_name || t('general.notAvailable', ['N/A'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Layers className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{t('programs.phase', ['Phase'])}</p>
                    <p>{program.phase?.name || t('general.notAvailable', ['N/A'])}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">ID</p>
                    <p>{program.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            {t('general.close', ['Close'])}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramDetailsModal;
