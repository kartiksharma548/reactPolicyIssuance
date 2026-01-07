import { FormHelperText, Stack, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import common from '../../../utils/common'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useEffect, useState } from 'react'
import UploadIcon from '@mui/icons-material/Upload'
import '../../../../assets/styles/FilesDragAndDrop.css'
import DeleteIcon from '@mui/icons-material/Delete'
import toast, { Toaster } from 'react-hot-toast'

export function FormInputFile(props: any) {
    const { control, name, label, onChangeFn, reset } = props
    const [files, setFiles] = useState<File[]>([])

    const handleFileChange = (event: any) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) 
        {
            debugger;
            if(selectedFiles.length>1)
            {
               toast.error('Multiple files not allowed')
                return 
            }
            const newFiles = Array.from(selectedFiles);
            var newname=newFiles[0].name;
            var extension=newname.substring(newname.lastIndexOf('.')+1);
            if((extension.toUpperCase()!="PNG") &&(extension.toUpperCase()!="JPEG")
            && (extension.toUpperCase()!="JPG")&& (extension.toUpperCase()!="DOCX")&& (extension.toUpperCase()!="PDF"))
        {
             toast.error('Please upload correct file')
                return 
        }
            if (newFiles[0].size / 1024 / 1024 > 2) {
                toast.error('File size cannot be greater than 2 MB.')
                return
            }
            setFiles((prevFiles) => [...prevFiles, ...newFiles])
        }
    }
    const handleDrop = (event: any) => {
        event.preventDefault()
        const droppedFiles = event.dataTransfer.files
        if (droppedFiles.length > 0) {
            debugger;
            if(droppedFiles.length>1)
            {
               toast.error('Multiple files not allowed')
                return 
            }
            const newFiles = Array.from(droppedFiles)
            var newname=newFiles[0].name;
            var extension=newname.substring(newname.lastIndexOf('.')+1);
            if((extension.toUpperCase()!="PNG") &&(extension.toUpperCase()!="JPEG")
            && (extension.toUpperCase()!="JPG")&& (extension.toUpperCase()!="DOCX")&& (extension.toUpperCase()!="PDF"))
        {
             toast.error('Please upload correct file')
                return 
        }
            if (newFiles[0].size / 1024 / 1024 > 2) {
                toast.error('File size cannot be greater than 2 MB.')
                return
            }

            reset({ ...control._formValues, [name]: event.dataTransfer.files })
            //setValue('CHEQUE_COPY', event.dataTransfer.files)
            setFiles((prevFiles) => [...prevFiles, ...newFiles])
        }
        
    }

    const handleRemoveFile = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
        reset({ ...control._formValues, [name]: undefined })
    }

    useEffect(() => {
        onChangeFn(files)
    }, [files])
    return (
        <>
            <Toaster />
            <Controller
                name={name}
                control={control}
                render={({
                    field: { onChange, value, ref, ...field },
                    fieldState: { error }
                }) => (
                    <Stack>
                        <section
                            className="drag-drop"
                            style={{ width: 300, height: 100 }}
                        >
                            <div
                                className={`document-uploader ${
                                    files.length > 0
                                        ? 'upload-box active'
                                        : 'upload-box'
                                }`}
                                style={{ padding: '0px' }}
                                onDrop={handleDrop}
                                onDragOver={(event) => event.preventDefault()}
                            >
                                {files.length == 0 && (
                                    <>
                                        <div className="upload-info">
                                            <UploadIcon />
                                            <div>
                                                <p style={{ fontSize: '12px' }}>
                                                    Drag and drop your files
                                                    here
                                                </p>
                                                <p style={{ fontSize: '10px' }}>
                                                    Limit 2MB per file.
                                                    Supported files: .PDF,
                                                    .DOCX, .JPG, .PNG, .JPEG
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            hidden
                                            id={name}
                                            accept=".pdf,.docx,.png,.jpg,.jpeg"
                                            multiple
                                            onChange={(e) => {
                                                onChange(e.target.files)
                                                handleFileChange(e)
                                            }}
                                        />
                                        <label
                                            htmlFor={name}
                                            className="browse-btn"
                                        >
                                            Browse files
                                        </label>
                                    </>
                                )}

                                {files.length > 0 && (
                                    <div className="file-list">
                                        <div className="file-list__container">
                                            {files.map((file, index) => (
                                                <div
                                                    className="file-item"
                                                    key={index}
                                                >
                                                    <div className="file-info">
                                                        <p>{file.name}</p>
                                                        {/* <p>{file.type}</p> */}
                                                    </div>
                                                    <div className="file-actions">
                                                        <DeleteIcon
                                                            onClick={() =>
                                                                handleRemoveFile(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {files.length > 0 && (
                                    <div className="success-file">
                                        <CheckCircleOutlineIcon
                                            style={{
                                                color: '#6DC24B',
                                                marginRight: 1
                                            }}
                                        />
                                        <p>{files.length} file(s) selected</p>
                                    </div>
                                )}
                            </div>
                        </section>
                        {error ? (
                            <FormHelperText sx={{ color: 'red' }}>
                                {error.message}
                            </FormHelperText>
                        ) : (
                            <></>
                        )}
                    </Stack>
                )}
            />
        </>
    )
}
