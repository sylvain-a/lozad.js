require('jsdom-global')()
const assert = require('assert')
const lozad = require('../dist/lozad.js')

describe('lozad', () => {
  describe('#lozad', () => {
    it('should be a function', () => {
      assert.equal('function', typeof lozad)
    })
  })

  describe('#lozad return value', () => {
    it('should be an object', () => {
      const observer = lozad()
      assert.equal('object', typeof observer)
    })

    it('should expose observe API', () => {
      const observer = lozad()
      assert.equal('function', typeof observer.observe)
    })
  })

  describe('images inside viewport without class lozad', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should not load image', () => {
      const observer = lozad()
      observer.observe()
      const image = document.getElementsByTagName('img')[0]
      assert.equal(undefined, image.dataset.loaded)
    })
  })

  describe('images inside viewport with class lozad', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      image.setAttribute('class', 'lozad')
      document.body.appendChild(image)
    })

    it('should not load an image till observe function is called', () => {
      lozad()
      const image = document.getElementsByTagName('img')[0]
      assert.equal(undefined, image.dataset.loaded)
    })

    it('should load an image after observe function is called', () => {
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport with different class', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load the image', () => {
      const className = 'test-class'
      const observer = lozad('.' + className)
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', className)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `Element` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load the image', () => {
      const node = document.querySelector('img')
      const observer = lozad(node)
      observer.observe()
      assert.equal('true', node.dataset.loaded)
      assert.equal(node.getAttribute('src'), node.dataset.src)
    })
  })

  describe('images inside viewport using a DOM `NodeList` reference', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
      const imageTwo = document.createElement('img')
      imageTwo.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(imageTwo)
    })

    it('should load the images', () => {
      const nodes = document.querySelectorAll('img')
      const observer = lozad(nodes)
      observer.observe()
      assert.equal(nodes.length, 2)
      nodes.forEach(node => {
        assert.equal('true', node.dataset.loaded)
        assert.equal(node.getAttribute('src'), node.dataset.src)
      })
    })
  })

  describe('images inside viewport with different attributes', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      document.body.appendChild(image)
    })

    it('should load the image with data-srcset attribute', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('srcset'), dataSrcSetAttr)
    })

    it('should load the image with data-background-image attribute', () => {
      const bgImageAttr = 'test-bg-image'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-background-image', bgImageAttr)
      observer.observe()
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.style.backgroundImage, 'url(' + bgImageAttr + ')')
    })
  })

  describe('when passing options', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should not load elements by default when custom load option is passed in', () => {
      const observer = lozad('.lozad', {
        load(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
      assert.equal(null, image.getAttribute('src'))
    })

    it('should run loaded option after loading an element', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
    })

    it('should set data attribute when loaded option is passed in', () => {
      const observer = lozad('.lozad', {
        loaded(element) {
          element.classList.add('loaded')
        }
      })
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      observer.observe()
      assert.equal(true, image.classList.contains('loaded'))
      assert.equal('true', image.dataset.loaded)
    })
  })

  describe('public API functions', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      const image = document.createElement('img')
      image.dataset.src = Math.random()
        .toString(36)
        .substring(7)
      document.body.appendChild(image)
    })

    it('should load image via triggerLoad function', () => {
      const dataSrcSetAttr = 'test-srcset'
      const observer = lozad()
      const image = document.getElementsByTagName('img')[0]
      image.setAttribute('class', 'lozad')
      image.setAttribute('data-srcset', dataSrcSetAttr)
      observer.triggerLoad(image)
      assert.equal('true', image.dataset.loaded)
      assert.equal(image.getAttribute('src'), image.dataset.src)
    })
  })

  // Describe('when passing IntersectionObserver options', () => {
  //   beforeEach(() => {
  //     document.body.innerHTML = ''
  //     const container = document.createElement('div')
  //     container.setAttribute('id', 'container')
  //     const anotherContainer = document.createElement('div')
  //     anotherContainer.setAttribute('id', 'anotherContainer')

  //     const image1 = document.createElement('img')
  //     image1.dataset.src = Math.random()
  //       .toString(36)
  //       .substring(7)
  //     const image2 = document.createElement('img')
  //     image2.dataset.src = Math.random()
  //       .toString(36)
  //       .substring(7)
  //     container.appendChild(image1)
  //     anotherContainer.appendChild(image2)
  //     document.body.append(container)
  //     document.body.append(anotherContainer)
  //   })

  //   it('should load the first image according options', () => {
  //     console.log("document.querySelector('#container')", document.querySelector('#container').innerHTML);
  //     const observer = lozad('img', {
  //       root: document.querySelector('#container')
  //     })
  //     const imageContainer = document.querySelector('#container img')
  //     const imageAnotherContainer = document.querySelector('#anotherContainer img')
  //     observer.observe()
  //     console.log("document.body.innerHTML", document.body.innerHTML);

  //   })

  //   it('should not load images according options', () => {

  //     console.log("document.body.innerHTML", document.body.innerHTML);
  //     const observer = lozad('img', {
  //       root: document.querySelector('#anotherContainer')
  //     })
  //     const imageContainer = document.querySelector('#container img')
  //     const imageAnotherContainer = document.querySelector('#anotherContainer img')
  //     observer.observe()
  //     console.log("document.body.innerHTML", document.body.innerHTML);

  //     // assert.equal(false, images[0].classList.contains('loaded'))
  //     // assert.equal(false, images[1].classList.contains('loaded'))
  //     // assert.equal('false', images[0].dataset.loaded)
  //     // assert.equal('false', images[1].dataset.loaded)
  //   })
  // })
})
