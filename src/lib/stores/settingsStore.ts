import { create } from 'zustand'
import { CarrierNumbers, CompanyInfo, FileDTO, Settings } from '../models/settings.model'

interface SettingsState {
  settings: Settings | null
  companyInfo: CompanyInfo | null
  carrierNumbers: CarrierNumbers | null
  carrierFiles: FileDTO[] | null
  setCompanyInfo: (companyInfo: CompanyInfo | null) => void
  setCarrierNumbers: (carrierNumbers: CarrierNumbers | null) => void
  setCarrierFiles: (carrierFiles: FileDTO[]) => void
}

export const useSettingsStore = create<SettingsState>(set => ({
  settings: null,
  companyInfo: null,
  carrierNumbers: null,
  carrierFiles: null,
  setCompanyInfo: (companyInfo: CompanyInfo | null) => {
    set(state => ({
      companyInfo,
      settings: { ...state.settings, companyInfo, carrierNumbers: state.carrierNumbers },
    }))
  },
  setCarrierFiles: (carrierFiles: FileDTO[]) => {
    set({ carrierFiles })
  },
  setCarrierNumbers: (carrierNumbers: CarrierNumbers | null) => {
    set(state => ({
      carrierNumbers,
      settings: { ...state.settings, carrierNumbers, companyInfo: state.companyInfo },
    }))
  },
}))
