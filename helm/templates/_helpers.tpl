# templates/_helpers.tpl
{{/*
Return the chart name.
*/}}
{{- define "dev-realm.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Return the chart fullname.
*/}}
{{- define "dev-realm.fullname" -}}
{{- $name := default .Chart.Name .Values.component -}}
{{- printf "%s-%s" $name .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
