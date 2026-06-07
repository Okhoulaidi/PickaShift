'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import {
  deleteCv,
  getSignedCvDownloadUrl,
  getSignedCvUploadUrl,
  saveCvUrl,
} from '@/lib/actions/profile';

interface Props {
  /** Storage path (cvs/{id}.pdf) or legacy public URL from older uploads. */
  currentCvUrl: string | null;
}

export function CvUploadClient({ currentCvUrl }: Props) {
  const [cvPath, setCvPath] = useState<string | null>(currentCvUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentCvUrl?.startsWith('http') ? currentCvUrl : null,
  );
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  useEffect(() => {
    if (!cvPath || cvPath.startsWith('http')) return;
    getSignedCvDownloadUrl().then((result) => {
      if (result.data?.url) setPreviewUrl(result.data.url);
    });
  }, [cvPath]);

  async function handleFile(file: File) {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      show('Only PDF files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      show('File must be under 5 MB.');
      return;
    }

    setUploading(true);
    try {
      const result = await getSignedCvUploadUrl();
      if (result.error) {
        show(result.error);
        return;
      }
      if (!result.data) {
        show('Could not prepare upload. Please try again.');
        return;
      }

      const uploadRes = await fetch(result.data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });

      if (!uploadRes.ok) {
        show('Upload failed. Please try again.');
        return;
      }

      const saveResult = await saveCvUrl(result.data.path);
      if (saveResult.error) {
        show(saveResult.error);
        return;
      }

      setCvPath(result.data.path);
      const dl = await getSignedCvDownloadUrl();
      if (dl.data?.url) setPreviewUrl(dl.data.url);
      show('CV uploaded successfully!');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCv();
    setDeleting(false);
    if (result.error) {
      show(result.error);
      return;
    }
    setCvPath(null);
    setPreviewUrl(null);
    show('CV removed.');
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 640 }}>
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-head">
          <div>
            <h3>Your CV</h3>
            <div className="ph-sub">Businesses see this when you apply for shifts. PDF only, max 5 MB.</div>
          </div>
          {cvPath && (
            <span className="badge badge-open">
              <span className="badge-dot" /> Uploaded
            </span>
          )}
        </div>

        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {cvPath ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="cv-file-row">
                <span className="cv-file-ico">
                  <Icon name="file" size={22} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>CV.pdf</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                    Visible to businesses reviewing your applications
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {previewUrl && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <Icon name="search" size={15} /> Preview
                    </a>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--primary)', borderColor: 'var(--primary-tint)' }}
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    <Icon name="x" size={15} /> {deleting ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </div>

              <div
                className={`cv-drop-zone${dragOver ? ' drag' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                style={{ borderStyle: 'dashed' }}
              >
                <Icon name="upload" size={20} style={{ color: 'var(--muted)' }} />
                <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 600 }}>
                  {uploading ? 'Uploading…' : 'Drop a new PDF here to replace, or click to browse'}
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`cv-drop-zone${dragOver ? ' drag' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="cv-upload-ico">
                <Icon name="upload" size={28} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
                  {uploading ? 'Uploading…' : 'Upload your CV'}
                </div>
                <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                  Drag & drop a PDF here, or{' '}
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>browse files</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 8 }}>PDF · max 5 MB</div>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>How businesses see your CV</h3>
          {[
            { icon: 'clipboard' as const, t: 'On every application', d: 'Businesses reviewing your application can open your CV directly from the applicant panel.' },
            { icon: 'users' as const, t: 'In the talent pool', d: 'If a business saves you to their talent pool, they can view your profile and CV for future shifts.' },
            { icon: 'shield' as const, t: 'You stay in control', d: 'Remove your CV at any time. Removing it hides it from all future applications immediately.' },
          ].map((item) => (
            <div key={item.t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span className="ds-ico" style={{ flexShrink: 0 }}>
                <Icon name={item.icon} size={18} />
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{item.t}</div>
                <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 3 }}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
