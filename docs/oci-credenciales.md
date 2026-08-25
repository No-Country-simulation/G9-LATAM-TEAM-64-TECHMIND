# Credenciales de OCI para el backend

Pasos en la consola de OCI, en **tu** tenancy. No tocan nada de la cuenta donde
está el bucket del modelo: son tenancies independientes.

Al final tendrás cinco valores que van como variables de entorno del servicio de
Spring en Northflank.

---

## 1. Crear el bucket

**Menú ☰ → Storage → Buckets → Create Bucket**

| Campo | Valor |
|---|---|
| Bucket Name | `techmind-documentos` |
| Default Storage Tier | Standard |
| Visibility | **Private** |

Privado a propósito. Las descargas se harán con enlaces temporales, no
abriendo el bucket al mundo.

Apunta también el **Namespace**, que aparece en la ficha del bucket. Es una
cadena corta tipo `axmpl1234abc`, la misma para toda tu tenancy.

## 2. Crear la clave de API

**Arriba a la derecha, tu avatar → My profile → API keys → Add API key**

Deja marcado *Generate API key pair* y pulsa **Download private key**. Guarda
ese `.pem`: solo se puede descargar una vez.

Pulsa **Add**. La consola te muestra entonces un bloque de configuración así:

```
[DEFAULT]
user=ocid1.user.oc1..aaaa....
fingerprint=12:34:56:78:....
tenancy=ocid1.tenancy.oc1..aaaa....
region=us-ashburn-1
key_file=<path to your private keyfile>
```

**Cópialo entero antes de cerrar la ventana.** Ahí están cuatro de los cinco
valores.

## 3. Los cinco valores

| Variable | De dónde sale |
|---|---|
| `OCI_TENANCY_OCID` | `tenancy=` del bloque anterior |
| `OCI_USER_OCID` | `user=` |
| `OCI_FINGERPRINT` | `fingerprint=` |
| `OCI_REGION` | `region=` |
| `OCI_PRIVATE_KEY` | el contenido completo del `.pem` descargado |
| `OCI_NAMESPACE` | el namespace de la ficha del bucket |
| `OCI_BUCKET` | `techmind-documentos` |

## 4. La clave privada en Northflank

Es lo único con truco. El PEM ocupa varias líneas:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBK...
...
-----END PRIVATE KEY-----
```

En el editor de variables de Northflank, pega el contenido tal cual, con sus
saltos de línea. El backend lo lee directamente; no hace falta convertirlo a
base64 ni juntarlo en una sola línea.

Márcala como **secreto**, no como variable normal.

## 5. Permisos

Si tu usuario es el administrador de la tenancy —lo normal en una cuenta
personal—, ya puede escribir en el bucket y no hay que hacer nada más.

Si no lo es, hace falta una política en **Identity → Policies**:

```
Allow group <tu-grupo> to manage objects in compartment <tu-compartimento>
Allow group <tu-grupo> to read buckets in compartment <tu-compartimento>
```

`manage objects` cubre subir, descargar y crear los enlaces temporales.

---

## Comprobar que funciona

Con la CLI de OCI instalada y configurada con esa misma clave:

```bash
echo "prueba" > /tmp/prueba.txt
oci os object put --bucket-name techmind-documentos --file /tmp/prueba.txt --name prueba.txt
oci os object list --bucket-name techmind-documentos
```

Si el `put` responde sin error, las credenciales y los permisos están bien y el
backend funcionará con los mismos valores.
