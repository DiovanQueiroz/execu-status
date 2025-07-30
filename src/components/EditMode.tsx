import { useState } from 'react';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectReport, Epic, Highlight, Blocker, HelpRequest, Action, Status } from '@/types/report';
import { useCreateReportVersion } from '@/hooks/useReports';
import { toast } from 'sonner';

interface EditModeProps {
  report: ProjectReport;
  reportId: string;
  onSuccess?: () => void;
}

export const EditMode = ({ report, reportId, onSuccess }: EditModeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<ProjectReport>(report);
  const [description, setDescription] = useState('');
  
  const createVersionMutation = useCreateReportVersion();

  const handleSave = async () => {
    if (!description.trim()) {
      toast.error('Por favor, adicione uma descrição para a nova versão');
      return;
    }

    try {
      await createVersionMutation.mutateAsync({
        reportId,
        report: {
          ...editedReport,
          version: report.version + 1,
          reportDate: new Date().toISOString().split('T')[0]
        },
        description,
        author: report.productOwner
      });
      
      setIsEditing(false);
      setDescription('');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleCancel = () => {
    setEditedReport(report);
    setIsEditing(false);
    setDescription('');
  };

  // Funções para gerenciar highlights
  const addHighlight = (highlight: Highlight) => {
    setEditedReport({
      ...editedReport,
      highlights: [...editedReport.highlights, highlight]
    });
  };

  const removeHighlight = (id: string) => {
    setEditedReport({
      ...editedReport,
      highlights: editedReport.highlights.filter(h => h.id !== id)
    });
  };

  // Funções para gerenciar blockers
  const addBlocker = (blocker: Blocker) => {
    setEditedReport({
      ...editedReport,
      blockers: [...editedReport.blockers, blocker]
    });
  };

  const removeBlocker = (id: string) => {
    setEditedReport({
      ...editedReport,
      blockers: editedReport.blockers.filter(b => b.id !== id)
    });
  };

  // Funções para gerenciar épicos
  const updateEpicStatus = (epicId: string, newStatus: Status) => {
    setEditedReport({
      ...editedReport,
      epics: editedReport.epics.map(epic =>
        epic.id === epicId ? { ...epic, status: newStatus } : epic
      )
    });
  };

  const removeEpic = (id: string) => {
    setEditedReport({
      ...editedReport,
      epics: editedReport.epics.filter(e => e.id !== id)
    });
  };

  // Funções para gerenciar help requests
  const removeHelpRequest = (id: string) => {
    setEditedReport({
      ...editedReport,
      helpRequests: editedReport.helpRequests.filter(h => h.id !== id)
    });
  };

  // Funções para gerenciar actions
  const removeAction = (id: string) => {
    setEditedReport({
      ...editedReport,
      actions: editedReport.actions.filter(a => a.id !== id)
    });
  };

  if (!isEditing) {
    return (
      <Button 
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Edit3 className="h-4 w-4" />
        Editar Relatório
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 bg-background border rounded-lg shadow-lg overflow-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Editando Relatório - Nova Versão</h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSave}
              disabled={createVersionMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {createVersionMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Descrição da versão */}
          <div>
            <Label htmlFor="description">Descrição da Nova Versão *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as mudanças desta versão..."
              className="mt-1"
            />
          </div>

          {/* Épicos */}
          <div>
            <h3 className="font-semibold mb-2">Épicos</h3>
            <div className="space-y-2">
              {editedReport.epics.map((epic) => (
                <div key={epic.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{epic.name}</span>
                  <Select
                    value={epic.status}
                    onValueChange={(value: Status) => updateEpicStatus(epic.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="yellow">Amarelo</SelectItem>
                      <SelectItem value="red">Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => removeEpic(epic.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Highlights</h3>
              <AddHighlightDialog onAdd={addHighlight} />
            </div>
            <div className="space-y-2">
              {editedReport.highlights.map((highlight) => (
                <div key={highlight.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{highlight.title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    highlight.type === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {highlight.type === 'positive' ? 'Positivo' : 'Negativo'}
                  </span>
                  <Button
                    onClick={() => removeHighlight(highlight.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Blockers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Bloqueios</h3>
              <AddBlockerDialog onAdd={addBlocker} />
            </div>
            <div className="space-y-2">
              {editedReport.blockers.map((blocker) => (
                <div key={blocker.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{blocker.title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    blocker.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    blocker.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {blocker.severity}
                  </span>
                  <Button
                    onClick={() => removeBlocker(blocker.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Help Requests */}
          <div>
            <h3 className="font-semibold mb-2">Solicitações de Ajuda</h3>
            <div className="space-y-2">
              {editedReport.helpRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{request.title}</span>
                  <Button
                    onClick={() => removeHelpRequest(request.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="font-semibold mb-2">Ações</h3>
            <div className="space-y-2">
              {editedReport.actions.map((action) => (
                <div key={action.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="flex-1">{action.title}</span>
                  <Button
                    onClick={() => removeAction(action.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para adicionar highlight
const AddHighlightDialog = ({ onAdd }: { onAdd: (highlight: Highlight) => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'positive' as 'positive' | 'negative',
    impact: 'medium' as 'high' | 'medium' | 'low'
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    onAdd({
      id: `highlight-${Date.now()}`,
      ...formData
    });
    
    setFormData({
      title: '',
      description: '',
      type: 'positive',
      impact: 'medium'
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Highlight</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'positive' | 'negative') => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positivo</SelectItem>
                <SelectItem value="negative">Negativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="impact">Impacto</Label>
            <Select
              value={formData.impact}
              onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, impact: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente para adicionar blocker
const AddBlockerDialog = ({ onAdd }: { onAdd: (blocker: Blocker) => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as 'critical' | 'high' | 'medium',
    owner: '',
    estimatedResolution: ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    onAdd({
      id: `blocker-${Date.now()}`,
      ...formData
    });
    
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      owner: '',
      estimatedResolution: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Bloqueio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="severity">Severidade</Label>
            <Select
              value={formData.severity}
              onValueChange={(value: 'critical' | 'high' | 'medium') => setFormData({ ...formData, severity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="owner">Responsável</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="estimatedResolution">Data Estimada de Resolução</Label>
            <Input
              id="estimatedResolution"
              type="date"
              value={formData.estimatedResolution}
              onChange={(e) => setFormData({ ...formData, estimatedResolution: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Adicionar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};