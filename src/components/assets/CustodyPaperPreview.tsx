import type { Asset, Employee, InventoryItem } from '../../types';

interface CustodyPaperPreviewProps {
  employee?: Employee;
  inventory: InventoryItem[];
  selectedInventoryIds: string[];
  serializedAssetsByInventoryId: Record<string, string>;
  assets: Asset[];
  manualAssetIds: string[];
  condition: string;
}

interface CustodyRow {
  type: string;
  quantity: number;
  specification: string;
  serialNumber: string;
  condition: string;
}

export default function CustodyPaperPreview({
  employee,
  inventory,
  selectedInventoryIds,
  serializedAssetsByInventoryId,
  assets,
  manualAssetIds,
  condition,
}: CustodyPaperPreviewProps) {
  const automaticAssetIds = Object.values(serializedAssetsByInventoryId);
  const rows: CustodyRow[] = selectedInventoryIds.flatMap(id => {
    const item = inventory.find(entry => entry.id === id);
    if (!item) return [];
    const linkedAsset = assets.find(asset => asset.id === serializedAssetsByInventoryId[id]);
    const assignedQuantity = linkedAsset ? 1 : Math.max(manualAssetIds.filter(Boolean).length, 1);
    const specification = linkedAsset
      ? `${linkedAsset.brand} ${linkedAsset.model}`.trim()
      : `${item.brand} ${item.model}`.trim();
    return [{
      type: item.name,
      quantity: assignedQuantity,
      specification: `${specification}\nS/N: ${linkedAsset?.serial_number || '—'}`,
      serialNumber: linkedAsset?.serial_number || '—',
      condition: condition === 'excellent' ? 'New' : 'Old',
    }];
  });

  const manualRows = manualAssetIds.filter(Boolean).filter(id => !automaticAssetIds.includes(id)).flatMap(id => {
    const asset = assets.find(entry => entry.id === id);
    if (!asset) return [];
    return [{
      type: asset.name,
      quantity: 1,
      specification: `${asset.brand} ${asset.model}\nS/N: ${asset.serial_number}`,
      serialNumber: asset.serial_number,
      condition: condition === 'excellent' ? 'New' : 'Old',
    }];
  });
  rows.push(...manualRows);

  return (
    <article className="custody-document" aria-label="Acknowledgment of receipt of custody preview">
      <header className="custody-letterhead" dir="ltr">
        <img className="custody-gs1-logo" src="/custody/image2.png" alt="GS1 Saudi Arabia" />
        <img className="custody-language-logo" src="/custody/image1.png" alt="The Global Language of Business" />
      </header>

      <div className="custody-document-heading">
        <h2 dir="rtl">إقرار استلام عهدة</h2>
        <p className="custody-title-english">Acknowledgment of receipt of custody</p>
        <p className="custody-dear" dir="ltr">Dear employee,</p>
      </div>

      <div className="custody-body">
        <table className="custody-employee-table" dir="rtl">
          <thead>
            <tr>
              <th>الاسم<br />Name</th>
              <th>الرقم الوظيفي<br />Job No.</th>
              <th>المسمى الوظيفي<br />Job title</th>
              <th>الإدارة / القسم<br />Department / section</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{employee?.full_name || ''}</td>
              <td>{employee?.employee_id || ''}</td>
              <td>{employee?.designation || ''}</td>
              <td>{employee?.department?.name || ''}</td>
            </tr>
          </tbody>
        </table>

        <div className="custody-ack-columns">
          <p dir="ltr">
            I, the employee whose details are shown above, acknowledge that I have received the aforementioned new mandate and I acknowledge that it is preserved and used for business purposes only, and I bear full responsibility in the event of its loss, theft or damage. I also acknowledged handing it over immediately to the administration if requested.
          </p>
          <p dir="rtl">
            أقر انا الموظف الموضحة بياناتي أعلاه باستلامي للعهد المذكورة سليمة وجديدة واتعهد بالحفاظ عليها واستخدامها لأغراض العمل فقط وفي حال رغبتي بنقلها خارج مقر العمل يجب أخذ الموافقة الخطية على ذلك مع تحمل كامل المسؤولية في الحفاظ عليها من التلف أو السرقة كما اتعهد بتسليمها فورا للإدارة في حال طلب مني ذلك.
          </p>
        </div>

        <table className="custody-items-table" dir="rtl">
          <thead>
            <tr>
              <th>النوع<br />Type</th>
              <th>العدد<br />No.</th>
              <th>المواصفات<br />Specifications</th>
              <th>الحالة<br />Condition</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.type}-${row.serialNumber}-${index}`}>
                <td>{row.type}</td>
                <td>{row.quantity}</td>
                <td className="custody-specification">{row.specification.split('\n').map((line, lineIndex) => <span key={lineIndex}>{line}</span>)}</td>
                <td>{row.condition}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(8 - rows.length, 0) }, (_, index) => (
              <tr key={`empty-${index}`} className="custody-empty-row"><td>&nbsp;</td><td></td><td></td><td></td></tr>
            ))}
          </tbody>
        </table>

        <footer className="custody-signature-row">
          <div dir="ltr">
            <p>Name:</p>
            <p>Date:</p>
            <p>Signature: ____________________</p>
          </div>
          <div dir="rtl">
            <p>الاسم:</p>
            <p>التاريخ:</p>
            <p>التوقيع: ____________________</p>
          </div>
        </footer>
      </div>

      <img className="custody-footer-art" src="/custody/image3.png" alt="GS1 Saudi Arabia contact information" />
    </article>
  );
}
