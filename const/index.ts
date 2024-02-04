
const reservedUsernames = [
    '0',
    'about',
    'access',
    'account',
    'accounts',
    'activate',
    'activities',
    'activity',
    'ad',
    'add',
    'address',
    'adm',
    'admin',
    'administration',
    'administrator',
    'ads',
    'adult',
    'advertising',
    'affiliate',
    'affiliates',
    'ajax',
    'all',
    'alpha',
    'analysis',
    'analytics',
    'android',
    'anon',
    'anonymous',
    'api',
    'app',
    'apps',
    'archive',
    'archives',
    'article',
    'asct',
    'asset',
    'atom',
    'auth',
    'authentication',
    'avatar',
    'backup',
    'balancer-manager',
    'banner',
    'banners',
    'beta',
    'billing',
    'bin',
    'blog',
    'blogs',
    'board',
    'book',
    'bookmark',
    'bot',
    'bots',
    'bug',
    'business',
    'cache',
    'cadastro',
    'calendar',
    'call',
    'campaign',
    'cancel',
    'captcha',
    'career',
    'careers',
    'cart',
    'categories',
    'category',
    'cgi',
    'cgi-bin',
    'changelog',
    'chat',
    'check',
    'checking',
    'checkout',
    'client',
    'cliente',
    'clients',
    'code',
    'codereview',
    'comercial',
    'comment',
    'comments',
    'communities',
    'community',
    'company',
    'compare',
    'compras',
    'config',
    'configuration',
    'connect',
    'contact',
    'contact-us',
    'contact_us',
    'contactus',
    'contest',
    'contribute',
    'corp',
    'create',
    'css',
    'dashboard',
    'data',
    'db',
    'default',
    'delete',
    'demo',
    'design',
    'designer',
    'destroy',
    'dev',
    'devel',
    'developer',
    'developers',
    'diagram',
    'diary',
    'dict',
    'dictionary',
    'die',
    'dir',
    'direct_messages',
    'directory',
    'dist',
    'doc',
    'docs',
    'documentation',
    'domain',
    'download',
    'downloads',
    'ecommerce',
    'edit',
    'editor',
    'edu',
    'education',
    'email',
    'employment',
    'empty',
    'end',
    'enterprise',
    'entries',
    'entry',
    'error',
    'errors',
    'eval',
    'event',
    'exit',
    'explore',
    'facebook',
    'faq',
    'favorite',
    'favorites',
    'feature',
    'features',
    'feed',
    'feedback',
    'feeds',
    'file',
    'files',
    'first',
    'flash',
    'fleet',
    'fleets',
    'flog',
    'follow',
    'followers',
    'following',
    'forgot',
    'form',
    'forum',
    'forums',
    'founder',
    'free',
    'friend',
    'friends',
    'ftp',
    'gadget',
    'gadgets',
    'game',
    'games',
    'get',
    'ghost',
    'gift',
    'gifts',
    'gist',
    'github',
    'graph',
    'group',
    'groups',
    'guest',
    'guests',
    'help',
    'home',
    'homepage',
    'host',
    'hosting',
    'hostmaster',
    'hostname',
    'howto',
    'hpg',
    'html',
    'http',
    'httpd',
    'https',
    'i',
    'iamges',
    'icon',
    'icons',
    'id',
    'idea',
    'ideas',
    'image',
    'images',
    'imap',
    'img',
    'index',
    'indice',
    'info',
    'information',
    'inquiry',
    'instagram',
    'intranet',
    'invitations',
    'invite',
    'ipad',
    'iphone',
    'irc',
    'is',
    'issue',
    'issues',
    'it',
    'item',
    'items',
    'java',
    'javascript',
    'job',
    'jobs',
    'join',
    'js',
    'json',
    'jump',
    'knowledgebase',
    'language',
    'languages',
    'last',
    'ldap-status',
    'legal',
    'license',
    'link',
    'links',
    'linux',
    'list',
    'lists',
    'log',
    'log-in',
    'log-out',
    'log_in',
    'log_out',
    'login',
    'logout',
    'logs',
    'm',
    'mac',
    'mail',
    'mail1',
    'mail2',
    'mail3',
    'mail4',
    'mail5',
    'mailer',
    'mailing',
    'maintenance',
    'manager',
    'manual',
    'map',
    'maps',
    'marketing',
    'master',
    'me',
    'media',
    'member',
    'members',
    'message',
    'messages',
    'messenger',
    'microblog',
    'microblogs',
    'mine',
    'mis',
    'mob',
    'mobile',
    'movie',
    'movies',
    'mp3',
    'msg',
    'msn',
    'music',
    'musicas',
    'mx',
    'my',
    'mysql',
    'name',
    'named',
    'nan',
    'navi',
    'navigation',
    'net',
    'network',
    'new',
    'news',
    'newsletter',
    'nick',
    'nickname',
    'notes',
    'noticias',
    'notification',
    'notifications',
    'notify',
    'ns',
    'ns1',
    'ns10',
    'ns2',
    'ns3',
    'ns4',
    'ns5',
    'ns6',
    'ns7',
    'ns8',
    'ns9',
    'null',
    'oauth',
    'oauth_clients',
    'offer',
    'offers',
    'official',
    'old',
    'online',
    'openid',
    'operator',
    'order',
    'orders',
    'organization',
    'organizations',
    'overview',
    'owner',
    'owners',
    'page',
    'pager',
    'pages',
    'panel',
    'password',
    'payment',
    'perl',
    'phone',
    'photo',
    'photoalbum',
    'photos',
    'php',
    'phpmyadmin',
    'phppgadmin',
    'phpredisadmin',
    'pic',
    'pics',
    'ping',
    'plan',
    'plans',
    'plugin',
    'plugins',
    'policy',
    'pop',
    'pop3',
    'popular',
    'portal',
    'post',
    'postfix',
    'postmaster',
    'posts',
    'pr',
    'premium',
    'press',
    'price',
    'pricing',
    'privacy',
    'privacy-policy',
    'privacy_policy',
    'privacypolicy',
    'private',
    'product',
    'products',
    'profile',
    'project',
    'projects',
    'promo',
    'pub',
    'public',
    'purpose',
    'put',
    'python',
    'query',
    'random',
    'ranking',
    'read',
    'readme',
    'recent',
    'recruit',
    'recruitment',
    'register',
    'registration',
    'release',
    'remove',
    'replies',
    'report',
    'reports',
    'repositories',
    'repository',
    'req',
    'request',
    'requests',
    'reset',
    'roc',
    'root',
    'rss',
    'ruby',
    'rule',
    'sag',
    'sale',
    'sales',
    'sample',
    'samples',
    'save',
    'school',
    'script',
    'scripts',
    'search',
    'secure',
    'security',
    'self',
    'send',
    'server',
    'server-info',
    'server-status',
    'service',
    'services',
    'session',
    'sessions',
    'setting',
    'settings',
    'setup',
    'share',
    'shop',
    'show',
    'sign-in',
    'sign-up',
    'sign_in',
    'sign_up',
    'signin',
    'signout',
    'signup',
    'site',
    'sitemap',
    'sites',
    'smartphone',
    'smtp',
    'soporte',
    'source',
    'spec',
    'special',
    'sql',
    'src',
    'ssh',
    'ssl',
    'ssladmin',
    'ssladministrator',
    'sslwebmaster',
    'staff',
    'stage',
    'staging',
    'start',
    'stat',
    'state',
    'static',
    'stats',
    'status',
    'store',
    'stores',
    'stories',
    'style',
    'styleguide',
    'stylesheet',
    'stylesheets',
    'subdomain',
    'subscribe',
    'subscriptions',
    'suporte',
    'support',
    'svn',
    'swf',
    'sys',
    'sysadmin',
    'sysadministrator',
    'system',
    'tablet',
    'tablets',
    'tag',
    'talk',
    'task',
    'tasks',
    'team',
    'teams',
    'tech',
    'telnet',
    'term',
    'terms',
    'terms-of-service',
    'terms_of_service',
    'termsofservice',
    'test',
    'test1',
    'test2',
    'test3',
    'teste',
    'testing',
    'tests',
    'theme',
    'themes',
    'thread',
    'threads',
    'tmp',
    'todo',
    'tool',
    'tools',
    'top',
    'topic',
    'topics',
    'tos',
    'tour',
    'translations',
    'trends',
    'tutorial',
    'tux',
    'tv',
    'twitter',
    'undef',
    'unfollow',
    'unsubscribe',
    'update',
    'upload',
    'uploads',
    'url',
    'usage',
    'user',
    'username',
    'users',
    'usuario',
    'vendas',
    'ver',
    'version',
    'video',
    'videos',
    'visitor',
    'watch',
    'weather',
    'web',
    'webhook',
    'webhooks',
    'webmail',
    'webmaster',
    'website',
    'websites',
    'welcome',
    'widget',
    'widgets',
    'wiki',
    'win',
    'windows',
    'word',
    'work',
    'works',
    'workshop',
    'ww',
    'wws',
    'www',
    'www1',
    'www2',
    'www3',
    'www4',
    'www5',
    'www6',
    'www7',
    'wwws',
    'wwww',
    'xfn',
    'xml',
    'xmpp',
    'xpg',
    'xxx',
    'yaml',
    'year',
    'yml',
    'you',
    'yourdomain',
    'yourname',
    'yoursite',
    'yourusername'
];

export {
    reservedUsernames
}