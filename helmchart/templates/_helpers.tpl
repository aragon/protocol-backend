{{/*
Expand the name of the chart.
*/}}
{{- define "chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "chart.labels" -}}
helm.sh/chart: {{ include "chart.chart" . }}
{{ include "chart.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Get the app config name.
*/}}
{{- define "chart.appConfigName" -}}
{{- if .Values.app.config.existingConfigMap -}}
{{- printf "%s" .Values.app.config.existingConfigMap -}}
{{- else -}}
{{- printf "%s-app-config" (include "chart.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/*
Get the server secret name.
*/}}
{{- define "chart.serverSecretName" -}}
{{- if .Values.server.secret.existingSecret -}}
{{- printf "%s" .Values.server.secret.existingSecret -}}
{{- else -}}
{{- printf "%s-server-secret" (include "chart.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/*
Get the server config name.
*/}}
{{- define "chart.serverConfigName" -}}
{{- if .Values.server.config.existingConfigMap -}}
{{- printf "%s" .Values.server.config.existingConfigMap -}}
{{- else -}}
{{- printf "%s-server-config" (include "chart.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/*
Get the service secret name.
*/}}
{{- define "chart.serviceSecretName" -}}
{{- if .Values.service.secret.existingSecret -}}
{{- printf "%s" .Values.service.secret.existingSecret -}}
{{- else -}}
{{- printf "%s-service-secret" (include "chart.fullname" .) -}}
{{- end -}}
{{- end -}}

{{/*
Get the service config name.
*/}}
{{- define "chart.serviceConfigName" -}}
{{- if .Values.service.config.existingConfigMap -}}
{{- printf "%s" .Values.service.config.existingConfigMap -}}
{{- else -}}
{{- printf "%s-service-config" (include "chart.fullname" .) -}}
{{- end -}}
{{- end -}}