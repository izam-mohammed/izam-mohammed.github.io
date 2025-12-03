# why does this file exist? am not sure either

.PHONY: build dev deploy clean help cry docs

build:
	@echo "there's nothin' to build. it's one html file."

dev:
	@echo "openin' index.html in browser..."
	@open index.html || xdg-open index.html || echo "just open it yourself am not your mom"

deploy:
	@echo "pushin' to main..."
	@git add . && git commit -m "am too lazy to write a proper commit message" && git push
	@echo "done. github actions will handle the rest. probably."

clean:
	@echo "clean what? there's nothin' to clean. go touch grass instead."

help:
	@echo "available commands:"
	@echo "  make build  - does nothin'"
	@echo "  make dev    - opens the website (hopefully)"
	@echo "  make deploy - yolo push to main"
	@echo "  make clean  - existential crisis"
	@echo "  make cry    - for when css isn't workin'"
	@echo "  make docs   - official documentation"

cry:
	@echo "there there. it's gonna be okay."
	@echo "have you tried clearin' your cache?"

docs:
	@echo "openin' the official documentation..."
	@open "https://www.google.com/search?q=how+to+print+hello+world+in+html" || xdg-open "https://www.google.com/search?q=how+to+print+hello+world+in+html"
