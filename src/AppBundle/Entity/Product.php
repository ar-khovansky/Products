<?php

namespace AppBundle\Entity;

use JMS\Serializer\Annotation as JMS;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Doctrine\ORM\Mapping as ORM;


/**
 * Product
 *
 * @JMS\ExclusionPolicy("all")
 * @JMS\AccessorOrder("custom", custom = {"id", "title", "description", "photoPath"})
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="AppBundle\Entity\ProductRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Product
{
    /**
     * @var integer
     *
     * @JMS\Expose
     * @JMS\ReadOnly
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @JMS\Expose
     * @JMS\Type("string")
     *
     * @Assert\NotBlank()
     * @Assert\Length(max=255)
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @JMS\Expose
     * @JMS\Type("string")
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @var string
     *
     * @JMS\Expose
     * @JMS\ReadOnly
     * @JMS\AccessType("public_method")
     * @JMS\Accessor(getter="getPhotoWebPath")
     * @JMS\Type("string")
     *
     * @ORM\Column(name="photoPath", type="string", length=255)
     */
    private $photoPath;

    /**
     * Image file
     *
     * @var UploadedFile
     *
     * @Assert\Image(
     *     maxSize = "2M",
     *     maxSizeMessage = "The maxmimum allowed file size is 2MB.",
     * )
     */
    private $photo;

    /**
     * Old photo path
     *
     * @var string
     */
    private $oldPhotoPath;



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Product
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Product
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Get photoPath
     *
     * @return string 
     */
    public function getPhotoPath()
    {
        return $this->photoPath;
    }

    /**
     * Set photo file
     *
     * @param UploadedFile $photo
     * @return Product
     */
    public function setPhoto(UploadedFile $file = null)
    {
        $this->photo = $file;

        // check if we have an old image path
        if ( ! empty($this->photoPath) ) {
            // store the old name to delete after the update
            $this->oldPhotoPath = $this->photoPath;
        }

        // Set photoPath here to allow file-only updates

        // generate a unique name
        $filename = sha1(uniqid(mt_rand(), true));
        $this->photoPath = $filename.'.'.$this->photo->guessExtension();

        return $this;
    }

    /**
     * Get file
     *
     * @return UploadedFile
     */
    public function getPhoto()
    {
        return $this->photo;
    }

    /**
     * Copy non-key fields from other object
     *
     * @param Product $other
     * @return Product
     */
    public function copyFrom(Product $other)
    {
        $this->title       = $other->getTitle();
        $this->description = $other->getDescription();

        return $this;
    }

    /**
     * @JMS\PostDeserialize
     */
    public function postDeserialize()
    {
        if ( $this->description === null )
            $this->description = '';
        if ( $this->photoPath === null )
            $this->photoPath = '';
    }


    public function getPhotoAbsolutePath()
    {
        return ! empty($this->photoPath)
            ? $this->getUploadRootDir().'/'.$this->photoPath
            : null;
    }

    public function getPhotoWebPath()
    {
        return ! empty($this->photoPath)
            ? $this->getUploadDir().'/'.$this->photoPath
            : null;
    }

    protected function getUploadRootDir()
    {
        // the absolute directory path where uploaded
        // images should be saved
        return __DIR__.'/../../../web/'.$this->getUploadDir();
    }

    protected function getUploadDir()
    {
        // get rid of the __DIR__ so it doesn't screw up
        // when displaying uploaded doc/image in the view.
        return 'uploads';
    }

    /**
     * Called after entity persistence
     *
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function postPersist()
    {
        // The file property can be empty if the field is not required
        if ( $this->photo === null )
            return;

        // if there is an error when moving the file, an exception will
        // be automatically thrown by move(). This will properly prevent
        // the entity from being persisted to the database on error
        $this->photo->move($this->getUploadRootDir(), $this->photoPath);

        // check if we have an old image
        if ( isset($this->oldPhotoPath) ) {
            // delete the old image
            unlink($this->getUploadRootDir().'/'.$this->oldPhotoPath);
            $this->oldPhotoPath = null;
        }

        $this->photo = null;
    }

    /**
     * Called before entity removal
     *
     * @ORM\PreRemove()
     */
    public function removePhoto()
    {
        if ( $file = $this->getPhotoAbsolutePath() )
            unlink($file);
    }
}
