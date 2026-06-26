# LiDu Garden — Print Bridge

Servicio que escucha pedidos en Firebase e imprime tickets automáticamente en la impresora térmica de cocina.

## Requisitos

- Node.js 18 o superior
- La máquina donde corra debe estar en la misma red WiFi que la impresora
- Impresora encendida y accesible en `192.168.1.100:9100`

## Instalación (solo la primera vez)

```bash
cd print-bridge
npm install
```

## Uso

```bash
node index.js
```

Deja la terminal abierta. El servicio escucha continuamente.
Para detenerlo: `Ctrl + C`

## Comportamiento

| Evento | Ticket impreso |
|--------|---------------|
| Mesa envía primer pedido | `MESA 5` + lista de platos en chino |
| Mesa añade más platos | `MESA 5 *** AÑADIDO ***` + los nuevos platos |
| Pedido para recoger | `*** PARA RECOGER ***  N° 3` + platos |

**Solo imprime platos de cocina.** Bebidas, postres, café, té y vinos nunca se imprimen.

## Solución de problemas

**"Timeout conectando a 192.168.1.100:9100"**
→ Verifica que la impresora esté encendida y en la misma red.
→ Prueba haciendo ping: `ping 192.168.1.100`

**Los caracteres chinos no se imprimen correctamente**
→ La impresora puede necesitar estar en modo GB18030/GBK.
→ Consulta el manual de la Approx appPOS80WIFI+LAN para activar el soporte chino.

**El servicio imprime pedidos viejos al arrancar**
→ No debería. El estado inicial se carga sin imprimir. Si ocurre, para el servicio, espera a que no haya pedidos activos y arráncalo de nuevo.
