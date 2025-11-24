import { useEffect } from "react";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Order {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryMethod: string;
  deliveryDate: Date;
  deliveryTime: string;
  deliveryAddress?: string | null;
  deliveryInstructions?: string | null;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  notes?: string | null;
  status: string;
  createdAt: Date;
}

interface OrderPrintViewProps {
  order: Order;
  items: OrderItem[];
  onClose: () => void;
  autoPrint?: boolean;
}

export function OrderPrintView({ order, items, onClose, autoPrint = false }: OrderPrintViewProps) {
  useEffect(() => {
    if (autoPrint) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.print();
        onClose();
      }, 500);
    }
  }, [autoPrint, onClose]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="print-view">
      {/* Screen overlay - hidden when printing */}
      <div className="fixed inset-0 bg-black/50 z-50 print:hidden" onClick={onClose} />
      
      {/* Print content */}
      <div className="fixed inset-0 z-50 overflow-auto print:relative print:inset-auto">
        <div className="min-h-screen flex items-center justify-center p-4 print:p-0 print:block">
          <div className="bg-white w-full max-w-3xl shadow-2xl print:shadow-none print:max-w-none">
            {/* Close button - hidden when printing */}
            <div className="flex justify-end p-4 gap-2 print:hidden border-b">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-black"
              >
                Imprimer
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>

            {/* Printable content */}
            <div className="p-8 print:p-6">
              {/* Header */}
              <div className="text-center mb-8 border-b-2 border-gray-900 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Les Touillés</h1>
                <p className="text-sm text-gray-600 mt-1">650 Rue de Montbrun, Boucherville, QC J4B 8G9</p>
                <p className="text-sm text-gray-600">Tél: 514-703-8678 | info@lestouilles.ca</p>
              </div>

              {/* Order Info */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Commande #{order.orderNumber}</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Date de commande:</p>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Statut:</p>
                    <p className="uppercase">{order.status}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-lg mb-3">Informations Client</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Nom:</p>
                    <p>{order.customerName}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Téléphone:</p>
                    <p>{order.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-700">Email:</p>
                    <p>{order.customerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6 bg-gray-50 p-4 rounded">
                <h3 className="font-bold text-lg mb-3">Informations de Livraison</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Méthode:</p>
                    <p className="uppercase">{order.deliveryMethod === "pickup" ? "Ramassage" : "Livraison"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Date:</p>
                    <p>{formatDate(order.deliveryDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Heure:</p>
                    <p>{order.deliveryTime}</p>
                  </div>
                  {order.deliveryAddress && (
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-700">Adresse:</p>
                      <p>{order.deliveryAddress}</p>
                    </div>
                  )}
                  {order.deliveryInstructions && (
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-700">Instructions:</p>
                      <p className="whitespace-pre-wrap">{order.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Articles Commandés</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 border">Article</th>
                      <th className="text-center p-2 border">Qté</th>
                      <th className="text-right p-2 border">Prix Unit.</th>
                      <th className="text-right p-2 border">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 border">{item.productName}</td>
                        <td className="text-center p-2 border font-semibold">{item.quantity}</td>
                        <td className="text-right p-2 border">{formatCurrency(item.unitPrice)}</td>
                        <td className="text-right p-2 border font-semibold">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mb-6 border-t-2 border-gray-300 pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Frais de livraison:</span>
                        <span>{formatCurrency(order.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taxes (TPS + TVQ):</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-2">
                      <span>TOTAL:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mb-6 bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                  <h3 className="font-bold text-lg mb-2">Notes:</h3>
                  <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
                <p>Merci de votre confiance!</p>
                <p className="mt-1">Pour toute question, contactez-nous au 514-703-8678</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .print-view {
            display: block !important;
          }
          
          @page {
            size: letter;
            margin: 0.5in;
          }
          
          /* Hide everything except print content */
          body > *:not(.print-view) {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          table {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
          }
          
          /* Better contrast for printing */
          .bg-gray-50 {
            background-color: #f9f9f9 !important;
          }
          
          .bg-gray-100 {
            background-color: #e5e5e5 !important;
          }
          
          .bg-yellow-50 {
            background-color: #fffef0 !important;
          }
          
          /* Ensure borders are visible */
          .border,
          .border-b,
          .border-t,
          .border-l-4 {
            border-color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
