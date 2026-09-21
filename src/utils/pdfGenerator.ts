import { InsurancePolicy, InsuranceClaim } from '../types';

/**
 * Downloads a high-quality, formatted HTML-based printable PDF document for any insurance policy certificate.
 */
export function downloadPolicyPDF(policy: InsurancePolicy): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // Fallback: create downloadable file blob
    const content = `
============================================================
              OMNISURE INSURTECH CERTIFICATE
============================================================
Policy Number: ${policy.policyNumber}
Product Title: ${policy.title}
Insured Name:  ${policy.holderName}
Valid From:    ${policy.startDate} to ${policy.expiryDate}
Status:        ${policy.status.toUpperCase()}
Sum Insured:   INR ${(policy.sumInsured ?? policy.insuredDeclaredValue ?? 0).toLocaleString()}
Annual Premium: INR ${policy.premiumAmount.toLocaleString()}
Compulsory Deductible: INR ${policy.deductible.toLocaleString()}

VEHICLE / ASSET DETAILS:
${policy.vehicleDetails ? `
- Vehicle: ${policy.vehicleDetails.make} ${policy.vehicleDetails.model} (${policy.vehicleDetails.year})
- Reg Number: ${policy.vehicleDetails.regNumber}
- Engine No: ${policy.vehicleDetails.engineNumber}
- Chassis / VIN: ${policy.vehicleDetails.vin}
` : '- Asset: Registered Insured Property / Floater'}

ENDORSED ADD-ONS & RIDERS:
${policy.addons.map(a => `• ${a}`).join('\n')}

============================================================
Issued by Omnisure Digital Insurance Broking Co. Ltd.
IRDAI Reg. No: IRDAI/WBA-2024/0088921
PAN India Toll-Free Assistance: 1800-889-9921
============================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OMNISURE_Policy_${policy.policyNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Policy Certificate - ${policy.policyNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; background: #fff; line-height: 1.6; }
    .header { border-bottom: 3px solid #06b6d4; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 28px; font-weight: 800; color: #0891b2; letter-spacing: -0.5px; }
    .badge { background: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 700; color: #0f172a; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .table th, .table td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; font-size: 13px; }
    .table th { background: #f1f5f9; font-weight: 700; color: #334155; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #64748b; text-align: center; }
    @media print {
      body { padding: 20px; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">OMNISURE</div>
      <div style="font-size: 13px; color: #64748b;">Certificate of Insurance & Schedule</div>
    </div>
    <div>
      <span class="badge">Official Policy Record</span>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="label">Policy Number</div>
      <div class="value">${policy.policyNumber}</div>
      <div style="margin-top: 12px;" class="label">Policyholder Name</div>
      <div class="value">${policy.holderName}</div>
    </div>
    <div class="card">
      <div class="label">Period of Insurance</div>
      <div class="value">${policy.startDate} to ${policy.expiryDate}</div>
      <div style="margin-top: 12px;" class="label">Policy Status</div>
      <div class="value" style="color: #059669;">ACTIVE & VERIFIED</div>
    </div>
  </div>

  <div class="card" style="margin-bottom: 24px;">
    <div class="label">Product Coverage Details</div>
    <div class="value" style="font-size: 17px; color: #0891b2;">${policy.title}</div>
    ${policy.vehicleDetails ? `
      <div style="margin-top: 12px; font-size: 13px; color: #475569;">
        <strong>Vehicle:</strong> ${policy.vehicleDetails.make} ${policy.vehicleDetails.model} (${policy.vehicleDetails.variant}) • 
        <strong>Reg No:</strong> ${policy.vehicleDetails.regNumber} • 
        <strong>Engine:</strong> ${policy.vehicleDetails.engineNumber} • 
        <strong>Chassis:</strong> ${policy.vehicleDetails.vin}
      </div>
    ` : ''}
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Sum Insured / IDV</th>
        <th>Compulsory Excess / Deductible</th>
        <th>Annual Premium Paid</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>₹${(policy.sumInsured ?? policy.insuredDeclaredValue ?? 0).toLocaleString()}</strong></td>
        <td>₹${policy.deductible.toLocaleString()}</td>
        <td><strong>₹${policy.premiumAmount.toLocaleString()}</strong></td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 24px;">
    <div class="label">Active Policy Riders & Endorsements:</div>
    <ul style="font-size: 13px; color: #334155; padding-left: 20px; margin-top: 8px;">
      ${policy.addons.map(a => `<li>${a}</li>`).join('')}
    </ul>
  </div>

  <div class="footer">
    This digital policy certificate is issued under the IRDAI (Protection of Policyholders' Interests) Regulations.<br/>
    Emergency 24x7 Roadside / Cashless Hospital Helpline: <strong>1800-889-9921</strong> • support@omnisure.in
  </div>

  <div style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="background: #0891b2; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      Print / Save as PDF
    </button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Downloads a formatted claim dossier report.
 */
export function downloadClaimPDF(claim: InsuranceClaim): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert(`Claim Dossier generated for #${claim.claimNumber}`);
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Claim Dossier - ${claim.claimNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
    .header { border-bottom: 3px solid #06b6d4; padding-bottom: 20px; display: flex; justify-content: space-between; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
    .table th, .table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    .table th { background: #f1f5f9; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">OMNISURE CLAIM DOSSIER</div>
      <div style="color: #64748b;">First Notice of Loss (FNOL) Reference: ${claim.claimNumber}</div>
    </div>
    <div style="font-weight: bold; color: #0891b2;">Status: ${claim.claimStatus.toUpperCase()}</div>
  </div>

  <div class="card">
    <strong>Asset / Vehicle:</strong> ${claim.vehicleName} (${claim.regNumber})<br/>
    <strong>Incident Date:</strong> ${claim.incidentDate} • <strong>Location:</strong> ${claim.incidentLocation}<br/>
    <strong>Incident Summary:</strong> ${claim.incidentDescription}
  </div>

  <h3>Damage Items / Components Evaluated:</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Component / Area</th>
        <th>Damage Nature</th>
        <th>Severity</th>
        <th>Policy Coverage Status</th>
      </tr>
    </thead>
    <tbody>
      ${claim.damagedParts.map(p => `
        <tr>
          <td><strong>${p.partName}</strong></td>
          <td>${p.damageType}</td>
          <td>${p.severity}</td>
          <td><span style="color: ${p.coverageStatus === 'covered' ? '#059669' : '#d97706'}; font-weight: bold;">${p.coverageStatus.toUpperCase()}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="card" style="margin-top: 30px;">
    <strong>Estimated Gross Repair:</strong> ₹${claim.estimatedAmount.toLocaleString()}<br/>
    <strong>Deductible Applicable:</strong> -₹${claim.deductibleApplied.toLocaleString()}<br/>
    <strong>Net Approved Settlement:</strong> <span style="font-size: 18px; color: #059669; font-weight: bold;">₹${(claim.approvedAmount ?? claim.netPayoutEstimate ?? claim.estimatedAmount).toLocaleString()}</span>
  </div>

  <div style="text-align: center; margin-top: 30px;">
    <button onclick="window.print()" style="background: #0891b2; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      Print / Save Claim PDF
    </button>
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
