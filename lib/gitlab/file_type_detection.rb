# frozen_string_literal: true

# The method `filename` must be defined in classes that use this module.
#
# This module is intended to be used as a helper and not a security gate
# to validate that a file is safe, as it identifies files only by the
# file extension and not its actual contents.
#
# An example useage of this module is in `FileMarkdownLinkBuilder` that
# renders markdown depending on a file name.
#
# We use Workhorse to detect the real extension when we serve files with
# the `SendsBlob` helper methods, and ask Workhorse to set the content
# type when it serves the file:
# https://gitlab.com/gitlab-org/gitlab-ce/blob/33e5955/app/helpers/workhorse_helper.rb#L48.
#
# Because Workhorse has access to the content when it is downloaded, if
# the type/extension doesn't match the real type, we adjust the
# `Content-Type` and `Content-Disposition` to the one we get from the detection.
module Gitlab
  module FileTypeDetection
    SAFE_IMAGE_EXT = %w[png jpg jpeg gif bmp tiff ico].freeze
    # We recommend using the .mp4 format over .mov. Videos in .mov format can
    # still be used but you really need to make sure they are served with the
    # proper MIME type video/mp4 and not video/quicktime or your videos won't play
    # on IE >= 9.
    # http://archive.sublimevideo.info/20150912/docs.sublimevideo.net/troubleshooting.html
    SAFE_VIDEO_EXT = %w[mp4 m4v mov webm ogv].freeze

    # These extension types can contain dangerous code and should only be embedded inline with
    # proper filtering. They should always be tagged as "Content-Disposition: attachment", not "inline".
    DANGEROUS_IMAGE_EXT = %w[svg].freeze
    DANGEROUS_VIDEO_EXT = [].freeze # None, yet

    VIDEO_EXT = (SAFE_VIDEO_EXT + DANGEROUS_VIDEO_EXT).freeze
    IMAGE_EXT = (SAFE_IMAGE_EXT + DANGEROUS_IMAGE_EXT).freeze

    def image?
      extension_match?(SAFE_IMAGE_EXT)
    end

    def video?
      extension_match?(VIDEO_EXT)
    end

    def image_or_video?
      image? || video?
    end

    def dangerous_image?
      extension_match?(DANGEROUS_IMAGE_EXT)
    end

    def dangerous_video?
      extension_match?(DANGEROUS_VIDEO_EXT)
    end

    def dangerous_image_or_video?
      dangerous_image? || dangerous_video?
    end

    private

    def extension_match?(extensions)
      return false unless filename

      extension = File.extname(filename).delete('.')
      extensions.include?(extension.downcase)
    end
  end
end
