import {Request, Response, Router} from "express"
import { compile } from "morgan"
import {Image, IImage} from "../models/Image"
import upload from "../middleware/multer-config"


const router: Router = Router()


router.get("/api/images",async (req: Request, res: Response) => {
    try {
        const images: IImage[] | null = await Image.find()

        if(!images) {
            return res.status(404).json({message: 'No images found'})
        }

        res.status(200).json(images)
        console.log('Images fetched successfully from database')
    } catch (error: any) {
        console.error(`Error while fetching a file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

})

router.get("/api/images/:id", async (req: Request, res: Response) => {
    try {
        const image: IImage | null = await Image.findById(req.params.id)
        
        if(!image) {
            return res.status(404).json({message: 'Image not found'})
        }
        res.status(200).json(image)
        console.log('Image fetched successfully from database')

    } catch (error: any) {
        console.error(`Error while fetching a file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

   
})

router.post("/api/upload", upload.single("image"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded"})
        }

        const imgPath: string = req.file.path.replace("public", "")

        const image: IImage = new Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath
        })
        await image.save()
        console.log("File uploaded and saved in the database")
        return res.status(201).json({message: "File uploaded and saved in the database"})
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }
 
    
})

router.patch("/api/images/:id", async (req: Request, res: Response) => {
    try {
        const image: IImage | null = await Image.findById(req.params.id)
        
        if(!image) {
            return res.status(404).json({message: 'Image not found'})
        }

        image.description = req.body.description
        await image.save()

        res.status(200).json({message: "Image updated"})
        console.log('Image updated')

    } catch (error: any) {
        console.error(`Error while updating a file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

   
})




export default router