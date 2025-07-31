import { ProjectReport } from '../types/report';

export const sampleReport: ProjectReport = {
  id: 'report-001',
  projectName: 'Sistema de E-commerce Mobile',
  reportDate: '2024-01-28',
  productOwner: 'Maria Silva',
  version: 1,
  bugs: {
    open: 12,
    resolved: 28,
    total: 40
  },
  timeline: {
    requirements: {
      name: 'Requirements & Discovery',
      status: 'green',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      progress: 85,
      description: 'Levantamento de requisitos e prototipagem concluídos. UX/UI em fase final de validação.'
    },
    development: {
      name: 'Development & Integration',
      status: 'yellow',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      progress: 45,
      description: 'Desenvolvimento do backend avançado. Frontend iniciado. Integração com APIs externas em andamento.'
    },
    qa: {
      name: 'QA & Launch Preparation',
      status: 'red',
      startDate: '2024-04-15',
      endDate: '2024-05-31',
      progress: 15,
      description: 'Ambiente de testes em configuração. Dependente da conclusão de features críticas do desenvolvimento.'
    }
  },
  epics: [
    {
      id: 'epic-001',
      name: 'Autenticação e Onboarding',
      status: 'green',
      owner: 'João Santos',
      dueDate: '2024-02-10',
      concerns: 'Aguardando aprovação final do design do fluxo de login social.',
      phase: 'requirements',
      userStories: [
        {
          id: 'story-001',
          ticketNumber: 'AUTH-001',
          name: 'Login com email e senha',
          boardStatus: 'Done',
          progress: 100
        },
        {
          id: 'story-002',
          ticketNumber: 'AUTH-002',
          name: 'Login social (Google/Facebook)',
          boardStatus: 'In Review',
          progress: 90
        },
        {
          id: 'story-003',
          ticketNumber: 'AUTH-003',
          name: 'Fluxo de onboarding',
          boardStatus: 'Done',
          progress: 100
        }
      ]
    },
    {
      id: 'epic-002',
      name: 'Catálogo de Produtos',
      status: 'yellow',
      owner: 'Ana Costa',
      dueDate: '2024-03-15',
      concerns: 'Performance de busca precisa ser otimizada para grandes volumes.',
      phase: 'development',
      userStories: [
        {
          id: 'story-004',
          ticketNumber: 'CAT-001',
          name: 'Listagem de produtos',
          boardStatus: 'Done',
          progress: 100
        },
        {
          id: 'story-005',
          ticketNumber: 'CAT-002',
          name: 'Busca e filtros',
          boardStatus: 'In Progress',
          progress: 60
        },
        {
          id: 'story-006',
          ticketNumber: 'CAT-003',
          name: 'Detalhes do produto',
          boardStatus: 'In Progress',
          progress: 50
        }
      ]
    },
    {
      id: 'epic-003',
      name: 'Carrinho e Checkout',
      status: 'red',
      owner: 'Pedro Lima',
      dueDate: '2024-04-01',
      concerns: 'Integração com gateway de pagamento atrasada. Bloqueio crítico.',
      phase: 'development',
      userStories: [
        {
          id: 'story-007',
          ticketNumber: 'CART-001',
          name: 'Adicionar itens ao carrinho',
          boardStatus: 'Done',
          progress: 100
        },
        {
          id: 'story-008',
          ticketNumber: 'CART-002',
          name: 'Finalizar pedido',
          boardStatus: 'To Do',
          progress: 0
        },
        {
          id: 'story-009',
          ticketNumber: 'PAY-001',
          name: 'Integração com pagamento',
          boardStatus: 'Blocked',
          progress: 10
        }
      ]
    },
    {
      id: 'epic-004',
      name: 'Sistema de Notificações',
      status: 'yellow',
      owner: 'Carla Mendes',
      dueDate: '2024-04-20',
      concerns: 'Definição de políticas de privacidade ainda pendente.',
      phase: 'development',
      userStories: [
        {
          id: 'story-010',
          ticketNumber: 'NOT-001',
          name: 'Push notifications',
          boardStatus: 'To Do',
          progress: 0
        },
        {
          id: 'story-011',
          ticketNumber: 'NOT-002',
          name: 'Email notifications',
          boardStatus: 'In Progress',
          progress: 40
        }
      ]
    },
    {
      id: 'epic-005',
      name: 'Relatórios e Analytics',
      status: 'red',
      owner: 'Rafael Torres',
      dueDate: '2024-05-10',
      concerns: 'Aguardando definição de métricas de negócio pela área comercial.',
      phase: 'qa',
      userStories: [
        {
          id: 'story-012',
          ticketNumber: 'RPT-001',
          name: 'Dashboard de vendas',
          boardStatus: 'To Do',
          progress: 0
        },
        {
          id: 'story-013',
          ticketNumber: 'ANA-001',
          name: 'Tracking de eventos',
          boardStatus: 'In Progress',
          progress: 20
        }
      ]
    }
  ],
  highlights: [
    {
      id: 'high-001',
      type: 'positive',
      title: 'Aprovação Unânime do Protótipo',
      description: 'O protótipo foi apresentado aos stakeholders e recebeu aprovação unânime. Feedback muito positivo sobre a experiência do usuário.',
      impact: 'high'
    },
    {
      id: 'high-002',
      type: 'positive',
      title: 'Performance Excepcional da API',
      description: 'Testes de carga mostraram que a API suporta 10x mais requisições que o inicialmente planejado.',
      impact: 'medium'
    },
    {
      id: 'high-003',
      type: 'negative',
      title: 'Atraso na Integração de Pagamentos',
      description: 'Problemas técnicos com o gateway de pagamento estão causando atrasos significativos no cronograma.',
      impact: 'high'
    },
    {
      id: 'high-004',
      type: 'negative',
      title: 'Rotatividade da Equipe de Frontend',
      description: 'Saída de dois desenvolvedores frontend impactou o cronograma das interfaces.',
      impact: 'medium'
    }
  ],
  blockers: [
    {
      id: 'block-001',
      title: 'Gateway de Pagamento - Problemas de Certificação',
      description: 'O gateway escolhido está enfrentando problemas com certificação PCI-DSS, impedindo a integração.',
      severity: 'critical',
      owner: 'Pedro Lima',
      estimatedResolution: '2024-02-15'
    },
    {
      id: 'block-002',
      title: 'Definição de Políticas de Privacidade',
      description: 'Time jurídico ainda não definiu políticas finais de privacidade, bloqueando features de notificação.',
      severity: 'high',
      owner: 'Carla Mendes',
      estimatedResolution: '2024-02-10'
    },
    {
      id: 'block-003',
      title: 'Aprovação de Budget para APIs Externas',
      description: 'Aguardando aprovação financeira para contratação de APIs de terceiros (geolocalização, analytics).',
      severity: 'medium',
      owner: 'Maria Silva',
      estimatedResolution: '2024-02-05'
    }
  ],
  helpRequests: [
    {
      id: 'help-001',
      title: 'Suporte de Infraestrutura para Ambiente de Produção',
      description: 'Precisamos de apoio do time de infraestrutura para configurar ambiente de produção com alta disponibilidade.',
      department: 'Infraestrutura',
      urgency: 'high',
      requestedBy: 'João Santos'
    },
    {
      id: 'help-002',
      title: 'Revisão de Métricas de Negócio',
      description: 'Necessário alinhamento com área comercial sobre métricas e KPIs que devem ser acompanhados.',
      department: 'Comercial',
      urgency: 'urgent',
      requestedBy: 'Rafael Torres'
    },
    {
      id: 'help-003',
      title: 'Consultoria em UX para Acessibilidade',
      description: 'Gostaríamos de uma consultoria especializada para garantir que o app atenda padrões de acessibilidade.',
      department: 'Design',
      urgency: 'normal',
      requestedBy: 'Ana Costa'
    }
  ],
  actions: [
    {
      id: 'action-001',
      title: 'Reunião de Alinhamento com Gateway Alternativo',
      description: 'Agendar reunião técnica com gateway alternativo para avaliação de viabilidade e cronograma.',
      owner: 'Pedro Lima',
      dueDate: '2024-02-02',
      priority: 'high',
      status: 'in-progress'
    },
    {
      id: 'action-002',
      title: 'Contratação de Desenvolvedores Frontend',
      description: 'Iniciar processo seletivo para reposição da equipe de frontend.',
      owner: 'Maria Silva',
      dueDate: '2024-02-10',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'action-003',
      title: 'Workshop de Definição de Métricas',
      description: 'Organizar workshop com todas as áreas para definir métricas e KPIs de negócio.',
      owner: 'Rafael Torres',
      dueDate: '2024-02-05',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: 'action-004',
      title: 'Otimização de Performance do Catálogo',
      description: 'Implementar cache e otimizações na busca de produtos para melhorar performance.',
      owner: 'Ana Costa',
      dueDate: '2024-02-20',
      priority: 'medium',
      status: 'pending'
    }
  ]
};