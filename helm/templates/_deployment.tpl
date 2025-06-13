{{/*
  Define a common deployment header.
  It includes metadata (name, namespace, labels) that can be reused.
*/}}
{{- define "dev-realm.deploymentHeader" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "dev-realm.fullname" . }}
  namespace: {{ .Values.namespace | default .Release.Namespace }}
  labels:
    app: {{ include "dev-realm.fullname" . }}
    environment: {{ .Values.environment }}
    app.kubernetes.io/managed-by: "Helm"
  annotations:
    meta.helm.sh/release-name: "{{ .Release.Name }}"
    meta.helm.sh/release-namespace: "{{ .Release.Namespace }}"
    logging: "enabled"
    loki.grafana.com/scrape: "true"
{{- end -}}
