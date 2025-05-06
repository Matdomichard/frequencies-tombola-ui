export interface HelloAssoForm {
  currency:    string;
  state:       string;
  title:       string;
  formSlug:    string;
  formType:    string;
  url:         string;
  organizationSlug: string;
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}
