import './index.less'
import { FC } from 'react';
import { ReactComponent as PreviewIcon } from "../../../components/icon/assets/preview.svg";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";



interface PreviewDocProps {
  uploadedFileUrl: string;
}

const PreviewDoc: FC<PreviewDocProps> = ({ uploadedFileUrl }) => {







  const docs = [{ uri: uploadedFileUrl }];
  const config = {
    header: {
      disableHeader: true,
    },
    sidebar: {
      disableSidebar: true,
    },
    textSelection: {
      disableTextSelection: true,
    },
    outline: {
      disableOutline: true,
    },
    search: {
      disableSearch: true,
    },
    thumbnailNavigation: {
      disableThumbnailNavigation: true,
    },
    navigation: {
      disableZoomIn: true,
      disableZoomOut: true,
      disableFullScreen: true,
      disableRotate: true,
      disablePageNavigation: true,
    },
  };
  return (
    <div>
      {uploadedFileUrl === '' ? (
        <div className={'preview'}>
          <PreviewIcon className={'preview-icon'}/>
          <div className={'preview-container-text'}>
            <h2 className={'preview-title'}>Place for your application preview</h2>
            <p className={'preview-text'}>Your application will be displayed here after uploading</p>
          </div>
        </div>
      ) : (

          <DocViewer
            documents={docs}
            initialActiveDocument={docs[0]}
            pluginRenderers={DocViewerRenderers}
            style={{ width: 504, height: 620, marginTop:24,borderRadius: 8 }}
            config={config}
          />

      )}
    </div>
  );
};

export default PreviewDoc;
