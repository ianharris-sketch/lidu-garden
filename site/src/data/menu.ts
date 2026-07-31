import type { Plato, Categoria } from '@/types';

export const CATEGORIAS: { id: Categoria; labelEs: string; labelZh: string }[] = [
  { id: 'menus',          labelEs: 'Menús',                                  labelZh: '套餐' },
  { id: 'novedades',      labelEs: 'Novedades',                              labelZh: '新品' },
  { id: 'ensaladas',      labelEs: 'Ensaladas',                              labelZh: '沙拉' },
  { id: 'sopas',          labelEs: 'Sopas',                                  labelZh: '汤类' },
  { id: 'entrantes',      labelEs: 'Entrantes',                              labelZh: '前菜' },
  { id: 'arroces',        labelEs: 'Acompañamientos',                        labelZh: '饭面类' },
  { id: 'sushi_maki',     labelEs: 'Maki y Rolls',                           labelZh: '卷寿司' },
  { id: 'sushi_pieza',    labelEs: 'Sushi',                                  labelZh: '握寿司' },
  { id: 'sashimi',        labelEs: 'Sashimi',                                labelZh: '刺身' },
  { id: 'pescado',        labelEs: 'Pescado y Marisco',                      labelZh: '海鲜' },
  { id: 'pato',           labelEs: 'Pato',                                   labelZh: '鸭类' },
  { id: 'pollo',          labelEs: 'Pollo',                                  labelZh: '鸡类' },
  { id: 'ternera',        labelEs: 'Ternera',                                labelZh: '牛肉' },
  { id: 'recien_llegados',labelEs: 'Recién Llegados',                        labelZh: '新菜' },
  { id: 'postres',        labelEs: 'Postres',                                labelZh: '甜点' },
  { id: 'bebidas',        labelEs: 'Bebidas – Refrescos',                    labelZh: '饮料' },
  { id: 'cafe_te',        labelEs: 'Café & Té',                              labelZh: '咖啡茶' },
  { id: 'vinos',          labelEs: 'Vinos',                                  labelZh: '葡萄酒' },
];

export const PLATOS: Plato[] = [
  // ── Novedades ────────────────────────────────────────────────────────────────
  { id: 'nov001', nombreEs: 'Gyozas Japonesas Coloridas (rellenos mixtos)', nombreZh: '彩色饺子',     precio: 6.20, foto: '/fotos/nov001.jpg', ingredientes: [], categoria: 'novedades', notas: '4 uds', descripcion: 'Cuatro gyozas, cuatro rellenos sorpresa: ternera, clásica, pollo con maíz y cerdo ibérico con boletus.', alergenos: [1,2,4] },
  { id: 'nov002', nombreEs: 'Bolas de Dragón Coloridas',                    nombreZh: '彩色小笼包',   precio: 6.20, foto: '/fotos/nov002.jpg', ingredientes: [], categoria: 'novedades', notas: '4 uds', descripcion: 'Cuatro dim sums caldosos: ibérico puro, gamba con ibérico, huevas de cangrejo y la versión tradicional.', alergenos: [1,2,4] },
  { id: 'nov003', nombreEs: 'Pastel de Boniato Relleno de Queso',           nombreZh: '芝士地瓜饼',   precio: 6.20, foto: '/fotos/nov003.jpg', ingredientes: [], categoria: 'novedades', notas: '2 uds', descripcion: 'Dos pastelitos de boniato con relleno suave de queso fundido.', alergenos: [7] },
  { id: 'nov004', nombreEs: 'Mousse de Pistacho',                           nombreZh: '开心果慕斯',   precio: 6.20, foto: '', ingredientes: [], categoria: 'novedades', descripcion: 'Galleta crujiente, nata cremosa y mousse de pistacho — el final perfecto.', alergenos: [5,7] },

  // ── Ensaladas ─────────────────────────────────────────────────────────────
  { id: 'ens001', nombreEs: 'Ensalada Japonesa',                            nombreZh: '日本沙拉',     precio: 14.50, foto: '', ingredientes: [], categoria: 'ensaladas', descripcion: 'Alga wakame, lechuga, salmón, huevas de pez volador, surimi y aguacate', alergenos: [2,4,5,6,12] },
  { id: 'ens002', nombreEs: 'Ensalada Tres Algas con Gamba',                nombreZh: '海带沙拉',     precio:  9.95, foto: '', ingredientes: [], categoria: 'ensaladas', descripcion: 'Algas agar, algas wakame y gambas', alergenos: [2,3,12] },
  { id: 'ens003', nombreEs: 'Ensalada de la Casa',                          nombreZh: '本店沙拉',     precio:  8.95, foto: '/fotos/ens003.jpg', ingredientes: [], categoria: 'ensaladas', descripcion: 'Algas, lechuga, tomates cherry, pollo y pepino', alergenos: [3,12] },

  // ── Sopas ─────────────────────────────────────────────────────────────────
  { id: 'sop001', nombreEs: 'Sopa Miso',                                    nombreZh: '味增汤',       precio: 4.95, foto: '/fotos/sop001.jpg', ingredientes: [], categoria: 'sopas', descripcion: 'Alga wakame, tofu, miso', alergenos: [4,6] },
  { id: 'sop002', nombreEs: 'Sopa Agripicante estilo Beijing',               nombreZh: '酸辣汤',       precio: 4.95, foto: '', ingredientes: [], categoria: 'sopas', descripcion: '', alergenos: [3,6,12] },
  { id: 'sop003', nombreEs: 'Sopa Wonton Pollo & Gamba',                    nombreZh: '馄饨汤',       precio: 5.25, foto: '', ingredientes: [], categoria: 'sopas', descripcion: '', alergenos: [1,2,6] },
  { id: 'sop004', nombreEs: 'Sopa Cremosa de Coco',                         nombreZh: '椰奶汤',       precio: 7.95, foto: '', ingredientes: [], categoria: 'sopas', descripcion: 'Pollo y solomillo de ternera', alergenos: [] },
  { id: 'sop005', nombreEs: 'Sopa Thai Tom Yum Kon',                        nombreZh: '东阳功汤',     precio: 8.95, foto: '', ingredientes: [], categoria: 'sopas', descripcion: '', alergenos: [2] },

  // ── Entrantes ─────────────────────────────────────────────────────────────
  { id: 'ent001', nombreEs: 'Pan Chino Frito',                              nombreZh: '面包',         precio:  2.20, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [1,7] },
  { id: 'ent002', nombreEs: 'Alga Frita',                                   nombreZh: '炸洋菜',       precio:  6.50, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [11] },
  { id: 'ent003', nombreEs: 'Pan de Gamba',                                 nombreZh: '虾片',         precio:  3.95, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [2] },
  { id: 'ent004', nombreEs: 'Tempura de Verdura',                           nombreZh: '蔬菜天妇罗',   precio:  7.95, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [1] },
  { id: 'ent005', nombreEs: 'Tempura de Marisco & Verduras',                nombreZh: '海鲜蔬菜天妇罗', precio: 13.95, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [1,2,4] },
  { id: 'ent006', nombreEs: 'Tempura de Langostino',                        nombreZh: '大虾天妇罗',   precio: 13.95, foto: '', ingredientes: [], categoria: 'entrantes', descripcion: '', alergenos: [1,2] },
  { id: 'ent007', nombreEs: 'Rollito Estilo Thai',                          nombreZh: '泰卷',         precio:  5.20, foto: '/fotos/ent007.jpg', ingredientes: [], categoria: 'entrantes', notas: '2 uds', descripcion: '', alergenos: [1] },
  { id: 'ent008', nombreEs: 'Rollito Vietnamita',                           nombreZh: '越卷',         precio:  5.50, foto: '/fotos/ent008.jpg', ingredientes: [], categoria: 'entrantes', notas: '2 uds', descripcion: '', alergenos: [] },
  { id: 'ent009', nombreEs: 'Mini Rollito de Gamba',                        nombreZh: '三鲜虾卷',     precio:  6.40, foto: '/fotos/ent009.jpg', ingredientes: [], categoria: 'entrantes', notas: '4 uds', descripcion: '', alergenos: [1,2] },
  { id: 'ent010', nombreEs: 'Saquitos de Fortuna',                           nombreZh: '发财袋',       precio:  6.40, foto: '/fotos/ent010.jpg', ingredientes: [], categoria: 'entrantes', notas: '4 uds', descripcion: '', alergenos: [1,4,7] },
  { id: 'ent011', nombreEs: 'Langostino Cubierto de Pan Rallado y Sésamo',  nombreZh: '越南炸虾',     precio:  9.95, foto: '/fotos/ent011.jpg', ingredientes: [], categoria: 'entrantes', notas: '6 uds', descripcion: '', alergenos: [1,2,3] },
  { id: 'ent012', nombreEs: 'Brocheta de Pollo Yakitori',                   nombreZh: '鸡串',         precio:  5.40, foto: '/fotos/ent012.jpg', ingredientes: [], categoria: 'entrantes', notas: '2 uds', descripcion: '', alergenos: [6,11] },
  { id: 'ent013', nombreEs: 'Surtido de Dim Sum',                           nombreZh: '点心',         precio:  6.50, foto: '/fotos/ent013.jpg', ingredientes: [], categoria: 'entrantes', notas: '4 uds', descripcion: '', alergenos: [1,2] },
  { id: 'ent014', nombreEs: 'Bola de Dragón',                               nombreZh: '小笼包',       precio:  5.00, foto: '', ingredientes: [], categoria: 'entrantes', notas: '4 uds', descripcion: 'Panecillo de carne y verduras', alergenos: [1] },
  { id: 'ent015', nombreEs: 'Gioza Empanadilla (Carne y Verduras)',         nombreZh: '锅贴',         precio:  5.00, foto: '/fotos/ent015.jpg', ingredientes: [], categoria: 'entrantes', notas: '4 uds', descripcion: 'Carne y verduras', alergenos: [1] },
  { id: 'ent016', nombreEs: 'Pechuga de Pollo Relleno de Queso',            nombreZh: '奶酪鸡',       precio:  6.00, foto: '', ingredientes: [], categoria: 'entrantes', notas: '6 uds', descripcion: '', alergenos: [1,3,7] },

  // ── Arroces y Tallarines ──────────────────────────────────────────────────
  { id: 'arr000', nombreEs: 'Arroz Blanco',                                  nombreZh: '白饭',         precio:  2.95, foto: '', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [] },
  { id: 'arr001', nombreEs: 'Arroz Frito Tres Delicias',                    nombreZh: '三鲜炒饭',     precio:  5.95, foto: '/fotos/arr001.jpg', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [3] },
  { id: 'arr002', nombreEs: 'Arroz Frito Lidu',                             nombreZh: '丽都炒饭',     precio:  7.50, foto: '', ingredientes: [], categoria: 'arroces', descripcion: 'Gambas, jamón, calamares, soja', alergenos: [2,3,6] },
  { id: 'arr003', nombreEs: 'Arroz Frito Japonés',                          nombreZh: '日本饭',       precio:  8.95, foto: '/fotos/arr003.jpg', ingredientes: [], categoria: 'arroces', descripcion: 'Setas Shitake, maíz, gambas', alergenos: [2,3,6] },
  { id: 'arr004', nombreEs: 'Arroz Frito Thai',                             nombreZh: '泰饭',         precio:  7.95, foto: '', ingredientes: [], categoria: 'arroces', descripcion: 'Pollo, cilantro y cebolla', alergenos: [3] },
  { id: 'arr005', nombreEs: 'Arroz Frito Especial Shanghai',                nombreZh: '上海菜饭',     precio:  7.95, foto: '', ingredientes: [], categoria: 'arroces', descripcion: 'Con verduras chinas y gambas', alergenos: [2,3] },
  { id: 'arr006', nombreEs: 'Arroz Frito con Curry',                        nombreZh: '咖喱菠萝饭',   precio:  7.95, foto: '', ingredientes: [], categoria: 'arroces', descripcion: 'Con gamba y piña', alergenos: [2] },
  { id: 'arr007', nombreEs: 'Kubak de Gambas',                              nombreZh: '虾巴',         precio:  9.95, foto: '/fotos/arr007.jpg', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [2,6] },
  { id: 'arr008', nombreEs: 'Tallarines Teppanyaki con Gambas & Verduras',  nombreZh: '铁板面',       precio:  8.50, foto: '', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [1,2,6] },
  { id: 'arr009', nombreEs: 'Tallarines de Soja Frito Tres Delicias',       nombreZh: '三鲜生粉面',   precio:  8.50, foto: '', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [2,3,6] },
  { id: 'arr010', nombreEs: 'Tallarines Caseros de mi Madre',               nombreZh: '碱面',         precio:  9.50, foto: '/fotos/arr010.jpg', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [1,2,6] },
  { id: 'arr011', nombreEs: 'Pai-Tai Tallarines de Arroz con Ternera Estilo Thai', nombreZh: '牛河', precio:  8.95, foto: '/fotos/arr011.jpg', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [3,6] },
  { id: 'arr012', nombreEs: 'Fideo de Arroz Frito con Gambas y Verduras',   nombreZh: '虾粉',         precio:  8.50, foto: '', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [2,3,6] },
  { id: 'arr013', nombreEs: 'Fideo de Arroz Frito estilo Singapur',         nombreZh: '新加坡炒粉',   precio:  8.50, foto: '/fotos/arr013.jpg', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [2,3] },
  { id: 'arr014', nombreEs: 'Cangrejos Fritos con Pasta de Arroz',          nombreZh: '年糕',         precio: 10.95, foto: '', ingredientes: [], categoria: 'arroces', descripcion: '', alergenos: [2,3] },

  // ── Sushi Maki ───────────────────────────────────────────────────────────
  { id: 'mak001', nombreEs: 'Maki de Salmón',                               nombreZh: 'Maki de Salmón',                    precio:  6.20, foto: '/fotos/mak001.jpg', ingredientes: [], categoria: 'sushi_maki', notas: '6 uds', descripcion: '', alergenos: [4] },
  { id: 'mak002', nombreEs: 'Maki de Atún',                                 nombreZh: 'Maki de Atún',                      precio:  6.50, foto: '/fotos/mak002.jpg', ingredientes: [], categoria: 'sushi_maki', notas: '6 uds', descripcion: '', alergenos: [4] },
  { id: 'mak003', nombreEs: 'Maki de Shurimi, Pepino o Aguacate',           nombreZh: 'Maki de Shurimi, Pepino o Aguacate', precio: 5.50, foto: '/fotos/mak003.jpg', ingredientes: [], categoria: 'sushi_maki', notas: '6 uds', descripcion: '', alergenos: [] },
  { id: 'mak004', nombreEs: 'Maki de Anguila con Aguacate',                 nombreZh: 'Maki de Anguila con Aguacate',      precio:  8.50, foto: '', ingredientes: [], categoria: 'sushi_maki', notas: '6 uds', descripcion: '', alergenos: [4] },
  { id: 'mak005', nombreEs: 'Sesamo Roll',                                  nombreZh: 'Sesamo Roll',                       precio:  8.95, foto: '', ingredientes: [], categoria: 'sushi_maki', notas: '8 uds', descripcion: '', alergenos: [3,4,11] },
  { id: 'mak006', nombreEs: 'California Roll',                              nombreZh: 'California Roll',                   precio: 10.95, foto: '/fotos/mak006.jpg', ingredientes: [], categoria: 'sushi_maki', notas: '8 uds', descripcion: '', alergenos: [2,3,4] },
  { id: 'mak007', nombreEs: 'Gambas Roll',                                  nombreZh: 'Gambas Roll',                       precio:  7.95, foto: '', ingredientes: [], categoria: 'sushi_maki', notas: '8 uds', descripcion: '', alergenos: [2,3,11] },

  // ── Sushi Pieza ──────────────────────────────────────────────────────────
  { id: 'sus001', nombreEs: 'Sushi de Salmón',                              nombreZh: 'Sushi de Salmón',                   precio:  5.50, foto: '/fotos/sus001.jpg', ingredientes: [], categoria: 'sushi_pieza', notas: '2 uds', descripcion: '', alergenos: [4] },
  { id: 'sus002', nombreEs: 'Sushi de Atún',                                nombreZh: 'Sushi de Atún',                     precio:  6.00, foto: '/fotos/sus002.jpg', ingredientes: [], categoria: 'sushi_pieza', notas: '2 uds', descripcion: '', alergenos: [4] },
  { id: 'sus003', nombreEs: 'Sushi de Gambas',                              nombreZh: 'Sushi de Gambas',                   precio:  5.40, foto: '/fotos/sus003.jpg', ingredientes: [], categoria: 'sushi_pieza', notas: '2 uds', descripcion: '', alergenos: [2] },
  { id: 'sus004', nombreEs: 'Sushi de Anguila',                             nombreZh: 'Sushi de Anguila',                  precio:  6.00, foto: '', ingredientes: [], categoria: 'sushi_pieza', notas: '2 uds', descripcion: '', alergenos: [4] },
  { id: 'sus005', nombreEs: 'Sushi de Pez de Mantequilla con Trufa',        nombreZh: 'Sushi de Pez de Mantequilla con Trufa', precio: 6.50, foto: '/fotos/sus005.jpg', ingredientes: [], categoria: 'sushi_pieza', notas: '2 uds', descripcion: '', alergenos: [4] },
  { id: 'sus006', nombreEs: 'Sushi Variado',                                nombreZh: 'Sushi Variado',                     precio: 18.00, foto: '/fotos/sus006.jpg', ingredientes: [], categoria: 'sushi_pieza', descripcion: '', alergenos: [2,4] },

  // ── Sashimi ──────────────────────────────────────────────────────────────
  { id: 'sas001', nombreEs: 'Sashimi de Salmón',                            nombreZh: 'Sashimi de Salmón',                 precio:  9.90, foto: '', ingredientes: [], categoria: 'sashimi', notas: '6 uds', descripcion: '', alergenos: [4] },
  { id: 'sas002', nombreEs: 'Sashimi de Atún',                              nombreZh: 'Sashimi de Atún',                   precio: 12.00, foto: '', ingredientes: [], categoria: 'sashimi', notas: '6 uds', descripcion: '', alergenos: [4] },
  { id: 'sas003', nombreEs: 'Sashimi Variado',                              nombreZh: 'Sashimi Variado',                   precio: 14.00, foto: '', ingredientes: [], categoria: 'sashimi', notas: '9 uds', descripcion: '', alergenos: [4] },
  { id: 'sas004', nombreEs: 'Sashimi & Sushi Variado',                      nombreZh: 'Sashimi & Sushi Variado',           precio: 21.00, foto: '', ingredientes: [], categoria: 'sashimi', notas: '15 uds', descripcion: '', alergenos: [2,4] },

  // ── Pescado y Marisco ─────────────────────────────────────────────────────
  { id: 'pes001', nombreEs: 'Pescado al Vapor Estilo Thai',                 nombreZh: '蒸鱼',         precio: 15.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [4,6] },
  { id: 'pes002', nombreEs: 'Salmón con Salsa Teriyaki',                    nombreZh: '鱼柳',         precio: 13.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [4,6,11] },
  { id: 'pes003', nombreEs: 'Langostino Salteado con Brócoli y Champiñones',nombreZh: '西草虾',       precio: 13.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2] },
  { id: 'pes004', nombreEs: 'Langostino Salteado con Verduras y Curry Rojo Thai', nombreZh: '咖喱虾', precio: 13.95, foto: '/fotos/pes004.jpg', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2] },
  { id: 'pes005', nombreEs: 'Langostino Salteado con Crema de Coco',        nombreZh: '椰奶虾',       precio: 13.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2] },
  { id: 'pes006', nombreEs: 'Langostino con Teriyaki Salsa',                nombreZh: '虾柳',         precio: 13.95, foto: '/fotos/pes006.jpg', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2,6,11] },
  { id: 'pes007', nombreEs: 'Langostino Salteado con Albahaca',             nombreZh: '金不换虾',     precio: 13.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2] },
  { id: 'pes008', nombreEs: 'Langostino Salteado con Bambú y Setas Chinas', nombreZh: '双冬虾',       precio: 13.95, foto: '', ingredientes: [], categoria: 'pescado', descripcion: '', alergenos: [2,6] },

  // ── Pato ─────────────────────────────────────────────────────────────────
  { id: 'pat001', nombreEs: 'Pato Laqueado Peking (entero)',                 nombreZh: '全鸭',         precio: 69.00, foto: '', ingredientes: [], categoria: 'pato', descripcion: 'Crujiente de piel, carne de pato, consomé de pato', alergenos: [1] },
  { id: 'pat002', nombreEs: '1/2 Pato Laqueado Peking',                     nombreZh: '半鸭',         precio: 36.00, foto: '', ingredientes: [], categoria: 'pato', descripcion: 'Crujiente de piel, carne de pato, consomé de pato', alergenos: [1] },
  { id: 'pat003', nombreEs: 'Ración Pato Laqueado Peking',                  nombreZh: '北京鸭',       precio: 18.50, foto: '/fotos/pat003.jpg', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1] },
  { id: 'pat004', nombreEs: 'Ración Pato Laqueado Peking (1/2 porción)',    nombreZh: '北京鸭半份',   precio: 16.95, foto: '', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1,11] },
  { id: 'pat005', nombreEs: 'Pato Asado estilo Osaka',                      nombreZh: '大阪鸭',       precio: 13.95, foto: '', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1] },
  { id: 'pat006', nombreEs: 'Pato Asado estilo Cantón',                     nombreZh: '广东鸭',       precio: 14.50, foto: '/fotos/pat006.jpg', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1] },
  { id: 'pat007', nombreEs: 'Pato Asado con Salsa de Naranja',              nombreZh: '桔汁鸭',       precio: 16.95, foto: '/fotos/pat007.jpg', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1] },
  { id: 'pat008', nombreEs: 'Pato Salteado con Piña y Salsa de Curry Rojo', nombreZh: '咖喱菠萝鸭',  precio: 15.50, foto: '', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [] },
  { id: 'pat009', nombreEs: 'Pato Asado con Salsa de Ciruela y Jengibre',   nombreZh: '苏梅鸭',       precio: 18.95, foto: '/fotos/pat009.jpg', ingredientes: [], categoria: 'pato', descripcion: '', alergenos: [1,6] },

  // ── Pollo ─────────────────────────────────────────────────────────────────
  { id: 'pol001', nombreEs: 'Tiras de Pollo Almendrado',                    nombreZh: '杏仁鸡白',     precio:  8.50, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [1,8] },
  { id: 'pol002', nombreEs: 'Pechuga de Pollo Rebozado con Salsa de Limón', nombreZh: '柠檬鸡',       precio:  8.50, foto: '/fotos/pol002.jpg', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [1,3] },
  { id: 'pol003', nombreEs: 'Dados de Pollo con Verdura y Curry Verde',     nombreZh: '咖喱鸡',       precio: 11.95, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [] },
  { id: 'pol004', nombreEs: 'Pollo con Bambú y Setas Chinas',               nombreZh: '双冬鸡',       precio:  8.95, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [6] },
  { id: 'pol005', nombreEs: 'Pollo Teppayaki con Puerros',                  nombreZh: '铁板鸡',       precio: 10.95, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [6] },
  { id: 'pol006', nombreEs: 'Dados de Pollo con Brócoli y Champiñones',     nombreZh: '西草鸡',       precio:  9.50, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [] },
  { id: 'pol007', nombreEs: 'Dado de Pollo con Cacahuete y Picante',        nombreZh: '宫爆鸡',       precio:  8.50, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [5,6] },
  { id: 'pol008', nombreEs: 'Delicias de Pollo Agridulce con Sésamo',       nombreZh: '甜酸芝麻鸡',   precio:  9.75, foto: '', ingredientes: [], categoria: 'pollo', descripcion: '', alergenos: [6,11,12] },

  // ── Ternera ──────────────────────────────────────────────────────────────
  { id: 'ter001', nombreEs: 'Ternera con Salsa de Ostras',                  nombreZh: '耗油牛肉',     precio:  8.50, foto: '/fotos/ter001.jpg', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [6] },
  { id: 'ter002', nombreEs: 'Ternera con Setas Chinas y Bambú',             nombreZh: '双冬牛肉',     precio:  9.25, foto: '', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [6] },
  { id: 'ter003', nombreEs: 'Ternera Crujiente con Salsa Agridulce',        nombreZh: '炸牛肉丝',     precio:  9.25, foto: '', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [1,3,11] },
  { id: 'ter004', nombreEs: 'Terneras Salteadas con Verduras y Salsa de Curry Rojo', nombreZh: '咖喱牛肉', precio: 11.95, foto: '', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [] },
  { id: 'ter005', nombreEs: 'Solomillo de Ternera con Salsa Teriyaki',      nombreZh: '日牛',         precio: 15.50, foto: '/fotos/ter005.jpg', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [6,11] },
  { id: 'ter006', nombreEs: 'Solomillo de Ternera con Salsa de Ciruela',    nombreZh: '香牛',         precio: 16.50, foto: '', ingredientes: [], categoria: 'ternera', descripcion: '', alergenos: [6] },

  // ── Recién Llegados ──────────────────────────────────────────────────────
  { id: 'rec001', nombreEs: 'Albóndigas Estilo Shanghai',                   nombreZh: '四喜丸子',     precio:  8.50, foto: '', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [6] },
  { id: 'rec002', nombreEs: 'Albóndigas de Cerdo Agridulce con Piña',       nombreZh: '古老肉',       precio:  8.25, foto: '', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [1,2] },
  { id: 'rec003', nombreEs: 'Tartar de Salmón con Trufa y Aguacate',        nombreZh: 'Tartar de Salmón con Trufa y Aguacate', precio: 15.95, foto: '/fotos/rec003.jpg', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [4,6] },
  { id: 'rec004', nombreEs: 'Tofu con Salsa',                               nombreZh: '豆腐',         precio:  7.95, foto: '/fotos/rec004.jpg', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [6] },
  { id: 'rec005', nombreEs: 'Tirabeques Salteados con Hongo de Madera',     nombreZh: '荷兰豆',       precio:  8.50, foto: '/fotos/rec005.jpg', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [] },
  { id: 'rec006', nombreEs: 'Verduras al Wok',                              nombreZh: '炒什锦',       precio:  7.25, foto: '', ingredientes: [], categoria: 'recien_llegados', descripcion: '', alergenos: [] },

  // ── Postres ──────────────────────────────────────────────────────────────
  { id: 'pos001', nombreEs: 'Pastel de Calabaza',                           nombreZh: 'Pastel de Calabaza',                    precio: 5.20, foto: '/fotos/pos001.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [] },
  { id: 'pos002', nombreEs: 'Mini Rollito con Helado de Chocolate',         nombreZh: 'Mini Rollito con Helado de Chocolate',   precio: 7.90, foto: '/fotos/pos002.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,3,7] },
  { id: 'pos003', nombreEs: 'Tiramisú Casero',                              nombreZh: 'Tiramisú Casero',                        precio: 5.95, foto: '/fotos/pos003.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,7] },
  { id: 'pos004', nombreEs: 'Crepe Casero con Crema de Soja Roja',          nombreZh: 'Crepe Casero con Crema de Soja Roja',    precio: 5.50, foto: '/fotos/pos004.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,3,7] },
  { id: 'pos005', nombreEs: 'Crepe Relleno de Nata y Frutas',               nombreZh: 'Crepe Relleno de Nata y Frutas',         precio: 5.20, foto: '/fotos/pos005.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,3,7] },
  { id: 'pos006', nombreEs: 'Leche Frita con Helado de Sésamo',             nombreZh: 'Leche Frita con Helado de Sésamo',       precio: 7.50, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [3,7,11] },
  { id: 'pos007', nombreEs: 'Plátano Frito con Coco Rallado',               nombreZh: 'Plátano Frito con Coco Rallado',         precio: 5.95, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [3] },
  { id: 'pos008', nombreEs: 'Pudding de Mango Casero',                      nombreZh: 'Pudding de Mango Casero',                precio: 4.95, foto: '/fotos/pos008.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [7] },
  { id: 'pos009', nombreEs: 'Bola de Sésamo Frito',                         nombreZh: 'Bola de Sésamo Frito',                   precio: 3.95, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [11] },
  { id: 'pos010', nombreEs: 'Mochi Pastel Japonés',                         nombreZh: 'Mochi Pastel Japonés',                   precio: 5.50, foto: '/fotos/pos010.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [7] },
  { id: 'pos011', nombreEs: 'Trufa de Té Verde',                            nombreZh: 'Trufa de Té Verde',                      precio: 5.20, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [7] },
  { id: 'pos012', nombreEs: 'Lychees',                                      nombreZh: 'Lychees',                                precio: 3.95, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [] },
  { id: 'pos013', nombreEs: 'Trufa de Sake',                                nombreZh: 'Trufa de Sake',                          precio: 5.20, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [7] },
  { id: 'pos014', nombreEs: 'Helado Frito con Miel',                        nombreZh: 'Helado Frito con Miel',                  precio: 5.50, foto: '', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,3,7,11] },
  { id: 'pos015', nombreEs: 'Helado Frito Flambeado',                       nombreZh: 'Helado Frito Flambeado',                 precio: 6.50, foto: '/fotos/pos015.jpg', ingredientes: [], categoria: 'postres', descripcion: '', alergenos: [1,3,7,11] },
  { id: 'pos016', nombreEs: 'Bola de Helado',                               nombreZh: 'Bola de Helado',                         precio: 3.50, foto: '', ingredientes: [], categoria: 'postres', descripcion: 'Elige sabor', alergenos: [7] },
  { id: 'pos017', nombreEs: 'Bola de Helado Especial',                      nombreZh: 'Bola de Helado Especial',                precio: 4.50, foto: '', ingredientes: [], categoria: 'postres', descripcion: 'Elige sabor', alergenos: [7] },

  // ── Bebidas ──────────────────────────────────────────────────────────────
  { id: 'beb001', nombreEs: 'Agua Mineral 1L',                              nombreZh: 'Agua Mineral 1L',                        precio: 3.60, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb002', nombreEs: 'Agua Mineral 1/2L',                            nombreZh: 'Agua Mineral 1/2L',                      precio: 2.60, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb003', nombreEs: 'Agua con Gas',                                 nombreZh: 'Agua con Gas',                           precio: 3.25, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb004', nombreEs: 'Refresco (Coca-Cola, Fanta, Nestea, etc.)',    nombreZh: 'Refresco (Coca-Cola, Fanta, Nestea, etc.)', precio: 2.90, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb005', nombreEs: 'Zumo (Melocotón, Piña, etc.)',                 nombreZh: 'Zumo (Melocotón, Piña, etc.)',           precio: 2.75, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb006', nombreEs: 'Cerveza',                                      nombreZh: 'Cerveza',                                precio: 2.95, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb007', nombreEs: 'Cerveza sin Alcohol',                          nombreZh: 'Cerveza sin Alcohol',                    precio: 3.50, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb008', nombreEs: 'Cerveza Heineken',                             nombreZh: 'Cerveza Heineken',                       precio: 3.50, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb009', nombreEs: 'Cerveza Especial (China, Japonesa, Thai)',     nombreZh: 'Cerveza Especial (China, Japonesa, Thai)', precio: 3.50, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb010', nombreEs: 'Alhambra Especial',                            nombreZh: 'Alhambra Especial',                      precio: 3.50, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb011', nombreEs: 'Tinto de Verano',                              nombreZh: 'Tinto de Verano',                        precio: 3.75, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },
  { id: 'beb012', nombreEs: 'Casera',                                       nombreZh: 'Casera',                                 precio: 2.60, foto: '', ingredientes: [], categoria: 'bebidas', descripcion: '', alergenos: [] },

  // ── Café & Té ─────────────────────────────────────────────────────────────
  { id: 'caf001', nombreEs: 'Café Solo',                                    nombreZh: 'Café Solo',                              precio: 2.00, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf002', nombreEs: 'Café Cortado',                                 nombreZh: 'Café Cortado',                           precio: 2.25, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf003', nombreEs: 'Café con Leche',                               nombreZh: 'Café con Leche',                         precio: 2.50, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf004', nombreEs: 'Café Descafeinado',                            nombreZh: 'Café Descafeinado',                      precio: 2.50, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf005', nombreEs: 'Café Bombón',                                  nombreZh: 'Café Bombón',                            precio: 2.25, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf006', nombreEs: 'Cappuccino',                                   nombreZh: 'Cappuccino',                             precio: 2.95, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf007', nombreEs: 'Carajillo',                                    nombreZh: 'Carajillo',                              precio: 2.95, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf008', nombreEs: 'Carajillo Quemado',                            nombreZh: 'Carajillo Quemado',                      precio: 3.95, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf009', nombreEs: 'Infusiones',                                   nombreZh: 'Infusiones',                             precio: 1.95, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf010', nombreEs: 'Té Chino',                                     nombreZh: 'Té Chino',                               precio: 2.75, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf011', nombreEs: 'Té Verde',                                     nombreZh: 'Té Verde',                               precio: 2.95, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },
  { id: 'caf012', nombreEs: 'Té Japonés Secha',                             nombreZh: 'Té Japonés Secha',                       precio: 3.50, foto: '', ingredientes: [], categoria: 'cafe_te', descripcion: '', alergenos: [] },

  // ── Vinos ─────────────────────────────────────────────────────────────────
  { id: 'vin001', nombreEs: 'Melior (Ribera del Duero)',                     nombreZh: 'Melior (Ribera del Duero)',               precio: 18.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin002', nombreEs: 'Finca Resalso (Ribera del Duero)',              nombreZh: 'Finca Resalso (Ribera del Duero)',        precio: 17.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin003', nombreEs: 'Pago de los Capellánes (Ribera del Duero)',     nombreZh: 'Pago de los Capellánes (Ribera del Duero)', precio: 25.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin004', nombreEs: 'Figureo Tempranillo (Ribera del Duero)',        nombreZh: 'Figureo Tempranillo (Ribera del Duero)',  precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin005', nombreEs: 'Tamara (Ribera del Duero)',                     nombreZh: 'Tamara (Ribera del Duero)',               precio: 16.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin006', nombreEs: 'Tarima Hill (Alicante Tinto)',                  nombreZh: 'Tarima Hill (Alicante Tinto)',            precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin007', nombreEs: 'Mo Salinas Monastrel',                          nombreZh: 'Mo Salinas Monastrel',                   precio: 13.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin008', nombreEs: 'Enrique Mendoza Merlot',                        nombreZh: 'Enrique Mendoza Merlot',                 precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin009', nombreEs: 'Sericis Cepas Vieja',                           nombreZh: 'Sericis Cepas Vieja',                    precio: 19.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin010', nombreEs: 'Rosario Vera (Rioja)',                           nombreZh: 'Rosario Vera (Rioja)',                   precio: 17.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin011', nombreEs: 'Ramón Bilbao (Rioja)',                           nombreZh: 'Ramón Bilbao (Rioja)',                   precio: 17.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin012', nombreEs: 'LAN Crianza (Rioja)',                            nombreZh: 'LAN Crianza (Rioja)',                    precio: 16.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin013', nombreEs: 'Luis Cañas Crianza (Rioja)',                     nombreZh: 'Luis Cañas Crianza (Rioja)',             precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin014', nombreEs: 'Habla del Silencio',                             nombreZh: 'Habla del Silencio',                    precio: 21.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin015', nombreEs: 'Juan Gil Crianza',                               nombreZh: 'Juan Gil Crianza',                      precio: 22.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin016', nombreEs: 'Lambrusco Tinto',                                nombreZh: 'Lambrusco Tinto',                       precio: 10.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin017', nombreEs: 'Honoro Vera',                                    nombreZh: 'Honoro Vera',                           precio: 15.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin018', nombreEs: 'Lambrusco Rosado',                               nombreZh: 'Lambrusco Rosado',                      precio: 10.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin019', nombreEs: 'Homenaje (Rosado)',                              nombreZh: 'Homenaje (Rosado)',                      precio: 11.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin020', nombreEs: 'Muga Rosé',                                      nombreZh: 'Muga Rosé',                             precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin021', nombreEs: 'Protos (Rosado)',                                nombreZh: 'Protos (Rosado)',                        precio: 15.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin022', nombreEs: 'Tarima Alicante (Rosado)',                       nombreZh: 'Tarima Alicante (Rosado)',               precio: 15.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin023', nombreEs: 'Enrique Mendoza (Rosado)',                       nombreZh: 'Enrique Mendoza (Rosado)',               precio: 19.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin024', nombreEs: 'Sanz de Rueda (Blanco)',                         nombreZh: 'Sanz de Rueda (Blanco)',                 precio: 14.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin025', nombreEs: 'Finca La Colina (Blanco)',                       nombreZh: 'Finca La Colina (Blanco)',               precio: 22.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin026', nombreEs: 'Shaya D.O. Rueda',                               nombreZh: 'Shaya D.O. Rueda',                      precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin027', nombreEs: 'Melio (Blanco)',                                  nombreZh: 'Melio (Blanco)',                        precio: 15.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin028', nombreEs: 'Perro Verde',                                     nombreZh: 'Perro Verde',                          precio: 22.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin029', nombreEs: 'Palomo Cojo',                                     nombreZh: 'Palomo Cojo',                          precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin030', nombreEs: 'Tamaral (Blanco)',                                nombreZh: 'Tamaral (Blanco)',                     precio: 15.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin031', nombreEs: 'Terras Gauda (Albariño)',                         nombreZh: 'Terras Gauda (Albariño)',               precio: 24.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin032', nombreEs: 'José Pariente (Albariño)',                        nombreZh: 'José Pariente (Albariño)',              precio: 23.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin033', nombreEs: 'Lolo (Albariño)',                                 nombreZh: 'Lolo (Albariño)',                       precio: 18.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin034', nombreEs: 'Martí Codax (Albariño)',                          nombreZh: 'Martí Codax (Albariño)',                precio: 22.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin035', nombreEs: 'Chan de Rosas (Albariño)',                        nombreZh: 'Chan de Rosas (Albariño)',              precio: 21.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin036', nombreEs: 'Tarima Hill (Alicante Blanco)',                   nombreZh: 'Tarima Hill (Alicante Blanco)',         precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin037', nombreEs: 'Marina Alta',                                     nombreZh: 'Marina Alta',                          precio: 11.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin038', nombreEs: 'Marina Espumante',                                nombreZh: 'Marina Espumante',                     precio: 11.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin039', nombreEs: 'Juan Gil Moscatel Seco',                          nombreZh: 'Juan Gil Moscatel Seco',               precio: 15.50, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },
  { id: 'vin040', nombreEs: 'Godello Brezo de Grégory Perez',                  nombreZh: 'Godello Brezo de Grégory Perez',       precio: 19.95, foto: '', ingredientes: [], categoria: 'vinos', descripcion: '', alergenos: [] },

  // ── Menús ─────────────────────────────────────────────────────────────────
  { id: 'men001', nombreEs: 'Menú del Día (martes a viernes mediodía – incluye bebida y postre)', nombreZh: 'Menú del Día',          precio: 13.95, foto: '', ingredientes: [], categoria: 'menus', notas: 'por persona', descripcion: '', alergenos: [] },
  { id: 'men002', nombreEs: 'Menú Japonés (mín. 2 personas)',                  nombreZh: 'Menú Japonés',                         precio: 29.00, foto: '', ingredientes: [], categoria: 'menus', notas: 'por persona, solo postre', descripcion: '', alergenos: [] },
  { id: 'men003', nombreEs: 'Menú Cantonés (mín. 2 personas)',                 nombreZh: 'Menú Cantonés',                        precio: 22.00, foto: '', ingredientes: [], categoria: 'menus', notas: 'por persona, solo postre', descripcion: '', alergenos: [] },
  { id: 'men004', nombreEs: 'Menú Degustación (mín. 2 personas)',              nombreZh: 'Menú Degustación',                     precio: 29.95, foto: '', ingredientes: [], categoria: 'menus', notas: 'por persona, solo postre', descripcion: '', alergenos: [] },
  { id: 'men005', nombreEs: 'Menú Vegetariano (mín. 2 personas)',              nombreZh: 'Menú Vegetariano',                     precio: 21.50, foto: '', ingredientes: [], categoria: 'menus', notas: 'por persona, solo postre', descripcion: '', alergenos: [] },
];

// Lookup map para cocina y sala: platoId → Plato
export const PLATOS_MAP: Record<string, Plato> = Object.fromEntries(
  PLATOS.map((p) => [p.id, p])
);

// ─── Destino (cocina vs barra) ──────────────────────────────────────────────

export const CATEGORIAS_BARRA = new Set<Categoria>(['postres', 'bebidas', 'cafe_te', 'vinos']);

export function getDestino(categoria: Categoria): 'cocina' | 'barra' {
  return CATEGORIAS_BARRA.has(categoria) ? 'barra' : 'cocina';
}

// Resolve destino from a platoId that might be synthetic (e.g. 'beb004_cocacola')
export function getDestinoFromPlatoId(platoId: string): 'cocina' | 'barra' {
  const plato = PLATOS_MAP[platoId] ?? PLATOS_MAP[platoId.split('_')[0]];
  if (!plato) return 'cocina';
  return getDestino(plato.categoria);
}

// ─── Menú del Día opciones ───────────────────────────────────────────────────

export interface OpcionMenu { nombre: string; suplemento: number }

export const MENU_DIA_PRECIO_BASE = 13.95;

export const MENU_DIA_PRIMER: OpcionMenu[] = [
  { nombre: 'Ensalada de la Casa (3,12)', suplemento: 0 },
  { nombre: 'Rollo Vegetal Thai', suplemento: 0 },
  { nombre: 'Sopa Miso', suplemento: 0 },
  { nombre: 'Sopa Agripicante (3,6,12)', suplemento: 0 },
  { nombre: 'Gyozas de Verdura con Pollo (+2€) (1)', suplemento: 2 },
  { nombre: 'Maki de Aguacate (+2€)', suplemento: 2 },
];

export const MENU_DIA_SEGUNDO: OpcionMenu[] = [
  { nombre: 'Arroz Frito Tres Delicias (3)', suplemento: 0 },
  { nombre: 'Tallarines con Pollo (1)', suplemento: 0 },
  { nombre: 'Arroz Blanco', suplemento: 0 },
  { nombre: 'Arroz Frito LiDu (+1€) (2,3,6)', suplemento: 1 },
];

export const MENU_DIA_PRINCIPAL: OpcionMenu[] = [
  { nombre: 'Dados de Pollo con Salsa de Curry', suplemento: 0 },
  { nombre: 'Pollo al Limón (1,3)', suplemento: 0 },
  { nombre: 'Tiras de Pollo Almendrados (1,8)', suplemento: 0 },
  { nombre: 'Pollo con Bambú y Setas Chinas (6)', suplemento: 0 },
  { nombre: 'Ternera con Salsa de Ostras (6)', suplemento: 0 },
  { nombre: 'Ternera con Cebolla (6)', suplemento: 0 },
  { nombre: 'Cerdo Agridulce (1,2)', suplemento: 0 },
  { nombre: 'Verduras al Wok', suplemento: 0 },
  { nombre: 'Pescado al Vapor (+2€) (4,6)', suplemento: 2 },
];

// ─── Menús fijos (Cantonés, Japonés, etc.) ───────────────────────────────────

export interface MenuFijoInfo { platos: string[]; minPersonas: number }

export const MENUS_FIJOS: Record<string, MenuFijoInfo> = {
  men002: {
    minPersonas: 2,
    platos: [
      'California Roll (2,3,4)', 'Nigiri de Salmón (4)', 'Nigiri de Pez de Mantequilla con Trufa (4)',
      'Gyoza de Pollo con Verduras (1)', 'Arroz Frito Japonés (2,3,6)',
      'Solomillo de Ternera con Salsa Teriyaki (6,11)', 'Mochi Japonés (7)',
    ],
  },
  men003: {
    minPersonas: 2,
    platos: [
      'Dim Sum (1,2)', 'Rollito Vegetal (1)', 'Arroz Frito Tres Delicias (3)',
      'Pollo al Limón (1,3)', 'Ternera con Salsa de Ostras (6)',
      'Pastel de Calabaza', 'Crêpe Relleno de Crema de Soja (1,3,7)',
    ],
  },
  men004: {
    minPersonas: 2,
    platos: [
      'Saquito de Fortuna (1,4,7)', 'Gyoza de Pollo con Verduras (1)',
      'Arroz Frito Estilo Shanghai (2,3)', 'Pato con Salsa Ciruela y Jengibre (1,6)',
      'Langostino con Salsa Curry Rojo Thai (2)',
      'Tiramisú Casero (1,7)', 'Mini Rollitos con Helado de Chocolate (1,3,7)',
    ],
  },
  men005: {
    minPersonas: 2,
    platos: [
      'Rollito Vegetal', 'Maki de Aguacate',
      'Arroz Frito con Huevo y Verduras (3)', 'Tofu con Salsa (6)',
      'Tirabeques con Hongos Salteados',
      'Pudding de Mango (7)', 'Helado de Té Matcha (7)',
    ],
  },
};

// ─── Selectores obligatorios ─────────────────────────────────────────────────

export interface SelectorObligatorio { label: string; opciones: string[] }

export const SELECTORES_OBLIGATORIOS: Record<string, SelectorObligatorio> = {
  mak003: {
    label: 'Elige el relleno',
    opciones: ['Surimi', 'Pepino', 'Aguacate'],
  },
  beb004: {
    label: 'Elige el refresco',
    opciones: ['Coca-Cola', 'Coca-Cola Zero', 'Coca-Cola Zero Zero', 'Fanta Naranja', 'Nestea', 'Seven Up'],
  },
  beb005: {
    label: 'Elige el zumo',
    opciones: ['Melocotón', 'Piña'],
  },
  beb009: {
    label: 'Elige la cerveza',
    opciones: ['China', 'Japonesa', 'Thai'],
  },
  pos016: {
    label: 'Elige el sabor',
    opciones: ['Chocolate', 'Vainilla', 'Fresa', 'Nata'],
  },
  pos017: {
    label: 'Elige el sabor',
    opciones: ['Violeta', 'Turrón', 'Sésamo', 'Té Verde', 'Frambuesa'],
  },
};

// ─── Leyenda de alérgenos ────────────────────────────────────────────────────

export const ALERGENOS_LEYENDA: Record<number, string> = {
  1:  'Gluten',
  2:  'Crustáceos',
  3:  'Huevos',
  4:  'Pescado',
  5:  'Cacahuetes',
  6:  'Soja',
  7:  'Lácteos',
  8:  'Frutos de cáscara',
  9:  'Apio',
  10: 'Mostaza',
  11: 'Granos de sésamo',
  12: 'Moluscos',
  13: 'Altramuces',
  14: 'Sulfitos',
};

// ─── Utilidad: elimina sufijos de alérgenos de strings de platos ─────────────

export function stripAlergenos(s: string): string {
  // Elimina "(1)", "(2,3)", "(+2€) (1)" etc. del final del string
  return s.replace(/(\s*\(\+?[\d€][^)]*\))+$/g, '').trim();
}

// ─── Nombres en chino para opciones del Menú del Día ─────────────────────────

export const MENU_DIA_NOMBRE_ZH: Record<string, string> = {
  'Ensalada de la Casa': '本店沙拉',
  'Rollo Vegetal Thai': '泰卷',
  'Sopa Miso': '味增汤',
  'Sopa Agripicante': '酸辣汤',
  'Gyozas de Verdura con Pollo': '锅贴',
  'Maki de Aguacate': '牛油果卷',
  'Arroz Frito Tres Delicias': '三鲜炒饭',
  'Tallarines con Pollo': '鸡肉面',
  'Arroz Blanco': '白饭',
  'Arroz Frito LiDu': '丽都炒饭',
  'Dados de Pollo con Salsa de Curry': '咖喱鸡',
  'Pollo al Limón': '柠檬鸡',
  'Tiras de Pollo Almendrados': '杏仁鸡白',
  'Pollo con Bambú y Setas Chinas': '双冬鸡',
  'Ternera con Salsa de Ostras': '耗油牛肉',
  'Ternera con Cebolla': '洋葱牛肉',
  'Cerdo Agridulce': '古老肉',
  'Verduras al Wok': '炒什锦',
  'Pescado al Vapor': '蒸鱼',
};

export const MESAS_INICIALES: { id: string; numero: number; zona: 'interior' | 'exterior' }[] = [
  // Interior: mesas 1-13
  ...Array.from({ length: 13 }, (_, i) => ({
    id: `mesa-${i + 1}`,
    numero: i + 1,
    zona: 'interior' as const,
  })),
  // Exterior: mesas 14-22
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `mesa-${i + 14}`,
    numero: i + 14,
    zona: 'exterior' as const,
  })),
];
