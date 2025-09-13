from utils.pdfReader import PDFTextExtractor

extractor = PDFTextExtractor("data/test.pdf")
text = extractor.get_text()
print(text)