
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Users, 
  ListVideo, 
  FileText, 
  User, 
  GraduationCap, 
  Briefcase, 
  Stethoscope,
  Mail,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUsers } from '@/services/api/users';
import { getPrograms } from '@/services/api/programs';
import { getEnfants } from '@/services/api/enfants';
import { getCartesTechniques } from '@/services/api/cartesTechniques';
import { getUserCountByRoles } from '@/services/api/users';
import { useLanguage } from '@/contexts/LanguageContext';
import { exportToCSV, prepareDataForExport } from '@/utils/exportCsv';
import { toast } from 'sonner';

// Utility to return appropriate icon by role
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'director':
      return <Briefcase className="h-8 w-8 text-purple-500" aria-hidden="true" />;
    case 'educateur':
      return <GraduationCap className="h-8 w-8 text-green-500" aria-hidden="true" />;
    case 'chef_groupe':
      return <Users className="h-8 w-8 text-cyan-600" aria-hidden="true" />;
    case 'infirmier':
      return <Stethoscope className="h-8 w-8 text-blue-700" aria-hidden="true" />;
    case 'economat':
      return <Briefcase className="h-8 w-8 text-orange-500" aria-hidden="true" />;
    case 'postman':
      return <Mail className="h-8 w-8 text-pink-500" aria-hidden="true" />;
    case 'normal':
      return <User className="h-8 w-8 text-slate-500" aria-hidden="true" />;
    default:
      return <User className="h-8 w-8 text-gray-400" aria-hidden="true" />;
  }
};

// Director Dashboard Component
const DirectorDashboard = () => {
  const { t } = useLanguage();
  
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const { data: enfantsData, isLoading: isLoadingEnfants } = useQuery({
    queryKey: ['enfants'],
    queryFn: getEnfants,
  });
  const { data: programsData, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });
  const { data: cartesTechniquesData } = useQuery({
    queryKey: ['cartes-techniques'],
    queryFn: getCartesTechniques,
  });

  const { data: userCountsByRole, isLoading: loadingCounts } = useQuery({
    queryKey: ['users', 'count-by-roles'],
    queryFn: getUserCountByRoles
  });

  // Prepare datasets for CSV exporting
  const users = Array.isArray(usersData) ? usersData : [];
  const programs = Array.isArray(programsData) ? programsData : [];
  const enfants = Array.isArray(enfantsData) ? enfantsData : [];
  const cartes = cartesTechniquesData && Array.isArray(cartesTechniquesData) ? cartesTechniquesData : [];

  const [phases, setPhases] = React.useState<any[]>([]);
  const [teams, setTeams] = React.useState<any[]>([]);
  
  // Lazy load phases & teams for CSV
  React.useEffect(() => {
    import('@/services/api/phases').then(api => {
      api.getPhases().then(setPhases);
    });
    import('@/services/api/teams').then(api => {
      api.getTeams().then(setTeams);
    });
  }, []);

  // Export roles statistics to CSV in an organized way
  const exportRolesToCSV = (roleStats: { title: string, value: number }[]) => {
    if (!roleStats || !roleStats.length) return;
    
    const columns = [
      { key: 'title', label: t('directorr.roleTitle', ['Role']) },
      { key: 'value', label: t('directorr.staffCount', ['Count']) },
    ];
    
    exportToCSV(roleStats, columns, 'staff_breakdown.csv');
    toast.success(t('director.exportSuccess', ['Staff data exported successfully']));
  };
  
  // New function to export staff data with more details
  const exportStaffData = () => {
    if (!users || users.length === 0) return;
    
    const columns = [
      { key: 'id', label: t('members.table.id', ['ID']) },
      { key: 'name', label: t('members.table.name', ['Name']) },
      { key: 'email', label: t('members.table.email', ['Email']) },
      { key: 'role', label: t('members.table.role', ['Role']) },
      { key: 'phone', label: t('members.table.phone', ['Phone']) },
      { key: 'created_at', label: t('members.table.createdAt', ['Joined']) },
    ];
    
    // Prepare data with better formatting for dates
    const preparedData = prepareDataForExport(users, {
      dateFields: ['created_at', 'updated_at'],
    });
    
    exportToCSV(preparedData, columns, 'staff_detailed.csv');
    toast.success(t('director.exportSuccess', ['Staff data exported successfully']));
  };
  
  // Export children data with better organization
  const exportChildrenData = () => {
    if (!enfants || enfants.length === 0) return;
    
    const columns = [
      { key: 'id', label: t('children.table.id', ['ID']) },
      { key: 'name', label: t('children.table.name', ['Name']) },
      { key: 'date_naissance', label: t('children.table.birthDate', ['Birth Date']) },
      { key: 'sexe', label: t('children.table.gender', ['Gender']) },
      { key: 'region', label: t('children.table.region', ['Region']) },
      { key: 'niveau_scolaire', label: t('children.table.schoolLevel', ['School Level']) },
      { key: 'participation_count', label: t('children.table.camps', ['Participations']) },
    ];
    
    // Prepare data with better formatting
    const preparedData = prepareDataForExport(enfants, {
      dateFields: ['date_naissance', 'date_examen_medical'],
    });
    
    exportToCSV(preparedData, columns, 'children_data.csv');
    toast.success(t('director.exportSuccess', ['Children data exported successfully']));
  };

  if (isLoadingUsers || isLoadingEnfants || isLoadingPrograms || loadingCounts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  const staffCount = users?.filter(user => user.role !== undefined).length || 0;
  const enfantCount = enfants?.length || 0;
  const totalPrograms = programs?.length || 0;
  const cartesTechniquesCount = cartesTechniquesData?.length || 0;

  const stats = [
    { title: t('directorr.totalStaff'), value: staffCount, icon: <Users className="h-8 w-8 text-purple-500" aria-hidden="true" pointerEvents="none" /> },
    { title: t('directorr.totalChildren'), value: enfantCount, icon: <Users className="h-8 w-8 text-blue-500" aria-hidden="true" pointerEvents="none" /> },
    { title: t('directorr.totalPrograms'), value: totalPrograms, icon: <ListVideo className="h-8 w-8 text-green-500" aria-hidden="true" pointerEvents="none" /> },
    { title: t('directorr.cartesTechniques'), value: cartesTechniquesCount, icon: <FileText className="h-8 w-8 text-orange-500" aria-hidden="true" pointerEvents="none" /> },
  ];

  // Use role translations instead of formatting the role string directly
  const roleStats = userCountsByRole?.map(({ role, total }) => ({
    title: t(`roles.${role}`), // Use translation for role names
    value: total,
    icon: getRoleIcon(role)
  })) || [];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t('directorr.welcome')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="pointer-events-none">{stat.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roleStats.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-2xl font-bold">{t('directorr.staffBreakdown')}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => exportRolesToCSV(roleStats)}
              >
                {t('director.exportCSV')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                onClick={exportStaffData}
              >
                {t('director.exportStaffDetailed', ['Export Staff Details'])}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                onClick={exportChildrenData}
              >
                {t('director.exportChildrenData', ['Export Children Data'])}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roleStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className="pointer-events-none">{stat.icon}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorDashboard;
