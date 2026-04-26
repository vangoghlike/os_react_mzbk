import { PageCard } from '../../../../shared/ui/PageCard';
import {
  plantOperationAirConditionerMock,
  plantOperationBankStatusMock,
  plantOperationBatteryMock,
  plantOperationBtbMock,
  plantOperationInverterLabelsMock,
  plantOperationPcsMock,
  plantOperationSolarMock
} from '../mock/plantOperationStatusMock';
import type { PlantOperationBankStatus, PlantOperationPanel } from '../types/plantOperationStatus';
import '../styles/PlantOperationDiagramSection.css';

function BankStatusCard({ bank }: { bank: PlantOperationBankStatus }) {
  return (
    <article className="plant-operation-bank" aria-label={`${bank.name} 상태`}>
      <div className="plant-operation-bank__grid">
        <span />
        <strong>Status</strong>
        <strong>D.Accm</strong>
        <strong>kW</strong>
        <span>{bank.status}</span>
        <span>{bank.dAccm}</span>
        <strong>PF</strong>
        <span>{bank.pf}</span>
        <span>{bank.kw}</span>
      </div>
      <div className="plant-operation-bank__label">{bank.name}</div>
    </article>
  );
}

function EquipmentPanel({ panel, className = '' }: { panel: PlantOperationPanel; className?: string }) {
  return (
    <article className={`plant-operation-panel ${className}`.trim()} aria-label={`${panel.title} 상태`}>
      <h3>{panel.title}</h3>
      <dl>
        {panel.rows.map((row) => (
          <div key={`${panel.title}-${row.label}`} className="plant-operation-panel__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/*
 * 필요: PPT의 발전소 운전현황 토폴로지 화면을 스크롤 가능한 대형 캔버스로 재현한다.
 * 연결: plantOperationStatusMock, PageCard, 라우트 /dashboard/plant-operation-status.
 * 설명: 3840 원본을 고정폭으로 박지 않고 1920 기준 최소 캔버스와 내부 스크롤로 보호한다.
 * 수정: 설비 위치와 선 간격은 styles/PlantOperationDiagramSection.css에서 조정한다.
 */
export function PlantOperationDiagramSection() {
  return (
    <PageCard title="발전설비 운영 현황" className="plant-operation-card">
      <div className="plant-operation-scroll" role="region" aria-label="발전소 운영현황 설비 토폴로지" tabIndex={0}>
        <div className="plant-operation-canvas">
          <div className="plant-operation-bank-row">
            {plantOperationBankStatusMock.map((bank) => (
              <BankStatusCard key={bank.name} bank={bank} />
            ))}
          </div>

          <div className="plant-operation-branch plant-operation-branch--bank" aria-hidden="true" />

          <div className="plant-operation-mid-row">
            <EquipmentPanel panel={plantOperationAirConditionerMock} className="plant-operation-panel--ac" />
            <div className="plant-operation-pill">AGC-BTB</div>
            <EquipmentPanel panel={plantOperationBtbMock} className="plant-operation-panel--btb" />
          </div>

          <div className="plant-operation-branch plant-operation-branch--main" aria-hidden="true" />

          <div className="plant-operation-inverter-row">
            <div className="plant-operation-pill plant-operation-pill--solar">AGC-Solar</div>
            <div className="plant-operation-inverters" aria-label="인버터 목록">
              {plantOperationInverterLabelsMock.map((label) => (
                <span key={label} className="plant-operation-inverter">
                  {label}
                </span>
              ))}
            </div>
            <EquipmentPanel panel={plantOperationSolarMock} className="plant-operation-panel--solar" />
          </div>

          <div className="plant-operation-bottom-row">
            <div className="plant-operation-pill plant-operation-pill--pcs">PCS</div>
            <EquipmentPanel panel={plantOperationPcsMock} className="plant-operation-panel--pcs" />
            <div className="plant-operation-pill plant-operation-pill--battery">배터리</div>
            <EquipmentPanel panel={plantOperationBatteryMock} className="plant-operation-panel--battery" />
          </div>
        </div>
      </div>
    </PageCard>
  );
}
